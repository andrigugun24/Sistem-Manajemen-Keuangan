<?php

namespace App\Http\Controllers;

use App\Models\TransaksiKas;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\KategoriKeuangan;
use App\Models\KategoriTagihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanController extends Controller
{
    /**
     * Dashboard Analitik — ringkasan keuangan visual.
     */
    public function dashboard(Request $request)
    {
        $tahun = (int) $request->get('tahun', Carbon::now()->year);

        $totalMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')->sum('nominal');
        $surplus = $totalMasuk - $totalKeluar;

        $totalTagihan = Tagihan::sum('nominal_tagihan');
        $totalLunas = Tagihan::where('status', 'lunas')->sum('nominal_tagihan');
        $kepatuhan = $totalTagihan > 0 ? round(($totalLunas / $totalTagihan) * 100, 1) : 0;

        // Chart: tren bulanan untuk tahun yang dipilih (Januari - Desember)
        $bulanLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartData = [];

        for ($m = 1; $m <= 12; $m++) {
            $masuk = TransaksiKas::where('tipe_transaksi', 'masuk')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $tahun)
                ->sum('nominal');
            $keluar = TransaksiKas::where('tipe_transaksi', 'keluar')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $tahun)
                ->sum('nominal');

            $chartData[] = [
                'bulan' => $bulanLabels[$m - 1],
                'masuk' => (int) $masuk,
                'keluar' => (int) $keluar,
            ];
        }

        // Pie: distribusi pengeluaran per kategori
        $kategoriData = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->join('kategori_keuangans', 'transaksi_kas.kategori_keuangan_id', '=', 'kategori_keuangans.id')
            ->select('kategori_keuangans.nama_kategori as name', DB::raw('SUM(transaksi_kas.nominal) as value'))
            ->groupBy('kategori_keuangans.nama_kategori')
            ->orderByDesc('value')
            ->limit(6)
            ->get()
            ->map(function ($item, $index) {
                $colors = ['#6366f1', '#10b981', '#f59e0b', '#e11d48', '#8b5cf6', '#64748b'];
                $item->color = $colors[$index] ?? '#94a3b8';
                return $item;
            });

        $totalKelForPercent = $kategoriData->sum('value');
        $kategoriData = $kategoriData->map(function ($item) use ($totalKelForPercent) {
            $item->value = $totalKelForPercent > 0 ? round(($item->value / $totalKelForPercent) * 100) : 0;
            return $item;
        });

        return Inertia::render('Laporan/Dashboard', [
            'stats' => [
                'totalPemasukan' => $totalMasuk,
                'totalPengeluaran' => $totalKeluar,
                'surplus' => $surplus,
                'kepatuhanSPP' => $kepatuhan,
            ],
            'chartData' => $chartData,
            'kategoriData' => $kategoriData->values(),
            'filters' => ['tahun' => $tahun],
        ]);
    }

    /**
     * Buku Besar Keuangan (Ledger).
     */
    public function keuangan(Request $request)
    {
        $query = TransaksiKas::with(['kategoriKeuangan', 'referensi' => function (\Illuminate\Database\Eloquent\Relations\MorphTo $morphTo) {
            $morphTo->morphWith([
                \App\Models\Pembayaran::class => ['siswa.kelas'],
                \App\Models\Penggajian::class => ['guru'],
            ]);
        }]);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_transaksi', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $transaksis = $query->latest('tanggal_transaksi')
            ->paginate(20)
            ->withQueryString();

        // Rekap untuk statistik atas
        $statsQuery = TransaksiKas::query();
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $statsQuery->whereBetween('tanggal_transaksi', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $totalMasuk = (clone $statsQuery)->where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKeluar = (clone $statsQuery)->where('tipe_transaksi', 'keluar')->sum('nominal');

        return Inertia::render('Laporan/Keuangan', [
            'transaksis' => $transaksis,
            'stats' => [
                'totalMasuk' => $totalMasuk,
                'totalKeluar' => $totalKeluar,
                'saldo' => $totalMasuk - $totalKeluar,
            ],
        ]);
    }

    /**
     * Rekap per Kategori.
     */
    public function rekapKategori(Request $request)
    {
        $rekapMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->join('kategori_keuangans', 'transaksi_kas.kategori_keuangan_id', '=', 'kategori_keuangans.id')
            ->select('kategori_keuangans.nama_kategori', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(transaksi_kas.nominal) as total'))
            ->groupBy('kategori_keuangans.nama_kategori')
            ->orderByDesc('total')
            ->get();

        $rekapKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->join('kategori_keuangans', 'transaksi_kas.kategori_keuangan_id', '=', 'kategori_keuangans.id')
            ->select('kategori_keuangans.nama_kategori', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(transaksi_kas.nominal) as total'))
            ->groupBy('kategori_keuangans.nama_kategori')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Laporan/RekapKategori', [
            'rekapMasuk' => $rekapMasuk,
            'rekapKeluar' => $rekapKeluar,
        ]);
    }

    /**
     * Export Laporan Rekap Kategori to PDF.
     */
    public function exportRekapKategoriPdf(Request $request)
    {
        $rekapMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->join('kategori_keuangans', 'transaksi_kas.kategori_keuangan_id', '=', 'kategori_keuangans.id')
            ->select('kategori_keuangans.nama_kategori', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(transaksi_kas.nominal) as total'))
            ->groupBy('kategori_keuangans.nama_kategori')
            ->orderByDesc('total')
            ->get();

        $rekapKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->join('kategori_keuangans', 'transaksi_kas.kategori_keuangan_id', '=', 'kategori_keuangans.id')
            ->select('kategori_keuangans.nama_kategori', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(transaksi_kas.nominal) as total'))
            ->groupBy('kategori_keuangans.nama_kategori')
            ->orderByDesc('total')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.rekap-kategori-pdf', [
            'rekapMasuk' => $rekapMasuk,
            'rekapKeluar' => $rekapKeluar,
            'user' => auth()->user(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('Laporan_Rekapitulasi_Kategori_Keuangan.pdf');
    }

    /**
     * Export Laporan Keuangan to PDF.
     */
    public function exportPdf(Request $request)
    {
        $query = TransaksiKas::with(['kategoriKeuangan', 'referensi' => function (\Illuminate\Database\Eloquent\Relations\MorphTo $morphTo) {
            $morphTo->morphWith([
                \App\Models\Pembayaran::class => ['siswa.kelas'],
                \App\Models\Penggajian::class => ['guru'],
            ]);
        }]);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_transaksi', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        } elseif ($request->filled('tahun')) {
            $query->whereYear('tanggal_transaksi', $request->tahun);
        }

        $transaksis = $query->orderBy('tanggal_transaksi', 'asc')->get();

        $statsQuery = TransaksiKas::query();
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $statsQuery->whereBetween('tanggal_transaksi', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        } elseif ($request->filled('tahun')) {
            $statsQuery->whereYear('tanggal_transaksi', $request->tahun);
        }

        $totalMasuk = (clone $statsQuery)->where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKeluar = (clone $statsQuery)->where('tipe_transaksi', 'keluar')->sum('nominal');
        $saldo = $totalMasuk - $totalKeluar;

        if ($request->filled('tahun')) {
            $startDate = '1 Jan ' . $request->tahun;
            $endDate = '31 Des ' . $request->tahun;
        } else {
            $startDate = $request->start_date ? Carbon::parse($request->start_date)->translatedFormat('d F Y') : null;
            $endDate = $request->end_date ? Carbon::parse($request->end_date)->translatedFormat('d F Y') : null;
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.keuangan-pdf', [
            'transaksis' => $transaksis,
            'totalMasuk' => $totalMasuk,
            'totalKeluar' => $totalKeluar,
            'saldo' => $saldo,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Keuangan_Yayasan.pdf');
    }

    /**
     * Laporan Rekapitulasi Tagihan Siswa (Data List)
     */
    public function tagihan(Request $request)
    {
        $query = Tagihan::with(['siswa.kelas', 'kategoriTagihan', 'tahunAjaran']);

        if ($request->filled('kategori_id') && $request->kategori_id !== 'all') {
            $query->where('kategori_tagihan_id', $request->kategori_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('jatuh_tempo', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $kategoriTagihans = KategoriTagihan::orderBy('nama_kategori')->get();

        $tagihans = $query->latest('jatuh_tempo')
            ->paginate(20)
            ->withQueryString();

        $statsQuery = clone $query;
        $totalTagihan = (clone $statsQuery)->sum('nominal_tagihan');
        $totalSisa = (clone $statsQuery)->sum('sisa_tagihan');
        $totalTerkumpul = $totalTagihan - $totalSisa;

        return Inertia::render('Laporan/TagihanSiswa', [
            'tagihans' => $tagihans,
            'kategoriTagihans' => $kategoriTagihans,
            'stats' => [
                'totalTagihan' => $totalTagihan,
                'totalTerkumpul' => $totalTerkumpul,
                'totalSisa' => $totalSisa,
            ],
            'filters' => $request->only(['kategori_id', 'status', 'start_date', 'end_date'])
        ]);
    }

    /**
     * Export Laporan Tagihan Siswa to PDF
     */
    public function exportTagihanPdf(Request $request)
    {
        $query = Tagihan::with(['siswa.kelas', 'kategoriTagihan', 'tahunAjaran']);

        $kategoriName = 'Semua Kategori';
        if ($request->filled('kategori_id') && $request->kategori_id !== 'all') {
            $query->where('kategori_tagihan_id', $request->kategori_id);
            $kategoriName = KategoriTagihan::find($request->kategori_id)?->nama_kategori ?? 'Kategori Dihapus';
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('jatuh_tempo', [
                $request->start_date,
                $request->end_date
            ]);
        }

        // Hitung stats DULU sebelum memanggil ->get()
        $totalTagihan = (clone $query)->sum('nominal_tagihan');
        $totalSisa = (clone $query)->sum('sisa_tagihan');
        $totalTerkumpul = $totalTagihan - $totalSisa;

        $tagihans = $query->orderBy('jatuh_tempo', 'asc')->get();

        $startDate = $request->start_date ? Carbon::parse($request->start_date)->translatedFormat('d M Y') : null;
        $endDate = $request->end_date ? Carbon::parse($request->end_date)->translatedFormat('d M Y') : null;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.tagihan-pdf', [
            'tagihans' => $tagihans,
            'totalTagihan' => $totalTagihan,
            'totalTerkumpul' => $totalTerkumpul,
            'totalSisa' => $totalSisa,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'kategoriName' => $kategoriName,
            'statusFilter' => $request->status ?? 'all',
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Tagihan_Siswa.pdf');
    }

    /**
     * Export Buku Tabungan Siswa to PDF
     */
    public function exportTabunganPdf(Request $request)
    {
        $siswaId = $request->get('siswa_id');
        if (!$siswaId) {
            return redirect()->back()->with('error', 'Silakan pilih siswa terlebih dahulu.');
        }

        $tabungan = \App\Models\Tabungan::with('siswa.kelas')->where('siswa_id', $siswaId)->first();
        if (!$tabungan) {
            return redirect()->back()->with('error', 'Data tabungan tidak ditemukan.');
        }

        $mutasis = \App\Models\MutasiTabungan::where('tabungan_id', $tabungan->id)
            ->orderBy('tanggal_mutasi', 'asc')
            ->get();

        // Hitung ringkasan untuk PDF
        $totalSetoran = $mutasis->where('jenis_mutasi', 'setor')->sum('nominal');
        $totalPenarikan = $mutasis->where('jenis_mutasi', 'tarik')->sum('nominal');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.tabungan-pdf', [
            'tabungan' => $tabungan,
            'mutasis' => $mutasis,
            'totalSetoran' => $totalSetoran,
            'totalPenarikan' => $totalPenarikan,
            'user' => auth()->user(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('Buku_Tabungan_' . ($tabungan->siswa->nama_lengkap ?? 'Siswa') . '.pdf');
    }
}
