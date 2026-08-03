<?php

namespace App\Http\Controllers;

use App\Models\TransaksiKas;
use App\Models\KategoriKeuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\AktivitasService;

class TransaksiKasController extends Controller
{
    /**
     * Kas Masuk — daftar pemasukan manual (non-pembayaran SPP).
     */
    public function masukIndex(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $transaksis = TransaksiKas::with('kategoriKeuangan')
            ->where('tipe_transaksi', 'masuk')
            ->whereNull('referensi_type') // hanya manual, bukan dari pembayaran
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->latest('tanggal_transaksi')
            ->paginate(15)
            ->withQueryString();

        // Stats bulan ini
        $totalBulanIni = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereNull('referensi_type')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->sum('nominal');
        $jumlahTransaksi = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereNull('referensi_type')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->count();

        $kategoriKeuangans = KategoriKeuangan::where('jenis', 'Pemasukan')->orderBy('nama_kategori')->get();

        return Inertia::render('Kas/Masuk/Index', [
            'transaksis' => $transaksis,
            'stats' => [
                'totalBulanIni' => $totalBulanIni,
                'jumlahTransaksi' => $jumlahTransaksi,
            ],
            'kategoriKeuangans' => $kategoriKeuangans,
            'filters' => $request->only(['bulan', 'tahun', 'search']),
        ]);
    }

    /**
     * Form catat pemasukan manual.
     */
    public function masukCreate()
    {
        $kategoriKeuangans = KategoriKeuangan::where('jenis', 'Pemasukan')->orderBy('nama_kategori')->get();

        return Inertia::render('Kas/Masuk/Create', [
            'kategoriKeuangans' => $kategoriKeuangans,
        ]);
    }

    /**
     * Simpan pemasukan manual ke transaksi_kas.
     */
    public function masukStore(Request $request)
    {
        $validated = $request->validate([
            'kategori_keuangan_id' => 'required|exists:kategori_keuangans,id',
            'nominal' => 'required|integer|min:1',
            'keterangan' => 'required|string|max:500',
            'tanggal_transaksi' => 'required|date',
        ]);

        $transaksi = TransaksiKas::create([
            ...$validated,
            'tipe_transaksi' => 'masuk',
        ]);

        AktivitasService::catat('Kas Masuk', 'App\Models\TransaksiKas', $transaksi->id, null, [
            'nominal' => $validated['nominal'],
            'keterangan' => $validated['keterangan'],
        ]);

        return redirect()->route('kas.masuk.index')->with('success', 'Pemasukan berhasil dicatat.');
    }

    /**
     * Kas Keluar — daftar pengeluaran manual.
     */
    public function keluarIndex(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $transaksis = TransaksiKas::with('kategoriKeuangan')
            ->where('tipe_transaksi', 'keluar')
            ->whereNull('referensi_type')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->latest('tanggal_transaksi')
            ->paginate(15)
            ->withQueryString();

        $totalBulanIni = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereNull('referensi_type')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->sum('nominal');
        $jumlahTransaksi = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereNull('referensi_type')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->count();

        $kategoriKeuangans = KategoriKeuangan::where('jenis', 'Pengeluaran')->orderBy('nama_kategori')->get();

        return Inertia::render('Kas/Keluar/Index', [
            'transaksis' => $transaksis,
            'stats' => [
                'totalBulanIni' => $totalBulanIni,
                'jumlahTransaksi' => $jumlahTransaksi,
            ],
            'kategoriKeuangans' => $kategoriKeuangans,
            'filters' => $request->only(['bulan', 'tahun', 'search']),
        ]);
    }

    /**
     * Form catat pengeluaran manual.
     */
    public function keluarCreate()
    {
        $kategoriKeuangans = KategoriKeuangan::where('jenis', 'Pengeluaran')->orderBy('nama_kategori')->get();

        return Inertia::render('Kas/Keluar/Create', [
            'kategoriKeuangans' => $kategoriKeuangans,
        ]);
    }

    /**
     * Simpan pengeluaran manual ke transaksi_kas.
     */
    public function keluarStore(Request $request)
    {
        $validated = $request->validate([
            'kategori_keuangan_id' => 'required|exists:kategori_keuangans,id',
            'nominal' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:500',
            'tanggal_transaksi' => 'required|date',
        ]);

        $transaksi = TransaksiKas::create([
            ...$validated,
            'tipe_transaksi' => 'keluar',
        ]);

        AktivitasService::catat('Kas Keluar', 'App\Models\TransaksiKas', $transaksi->id, null, [
            'nominal' => $validated['nominal'],
            'keterangan' => $validated['keterangan'] ?? '',
        ]);

        return redirect()->route('kas.keluar.index')->with('success', 'Pengeluaran berhasil dicatat.');
    }

    /**
     * Buku Kas Umum — gabungan masuk + keluar + otomatis.
     */
    public function bkuIndex(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        // Get BOS category IDs
        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');

        // All transactions for the period (Kas Umum only)
        $transaksis = TransaksiKas::with('kategoriKeuangan')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereNotIn('kategori_keuangan_id', $bosKategoriIds)
            ->latest('tanggal_transaksi')
            ->paginate(20)
            ->withQueryString();

        // Kas Umum stats (exclude BOS)
        $totalMasukUmum = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereNotIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $totalKeluarUmum = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereNotIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');

        // Dana BOS stats
        $bosMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $bosKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');

        // BOS transactions for BOS tab
        $bosTransaksis = TransaksiKas::with('kategoriKeuangan')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->latest('tanggal_transaksi')
            ->get();

        return Inertia::render('Kas/BKU/Index', [
            'transaksis' => $transaksis,
            'stats' => [
                'totalMasuk' => $totalMasukUmum,
                'totalKeluar' => $totalKeluarUmum,
                'saldo' => $totalMasukUmum - $totalKeluarUmum,
            ],
            'bosStats' => [
                'totalMasuk' => $bosMasuk,
                'totalKeluar' => $bosKeluar,
                'saldo' => $bosMasuk - $bosKeluar,
            ],
            'bosTransaksis' => $bosTransaksis,
            'filters' => $request->only(['bulan', 'tahun']),
        ]);
    }

    /**
     * Cetak Laporan BKU PDF
     */
    public function bkuPdf(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);
        $jenis = $request->get('jenis', 'umum');

        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');
        $query = TransaksiKas::with('kategoriKeuangan')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->orderBy('tanggal_transaksi', 'asc');

        if ($jenis === 'bos') {
            $query->whereIn('kategori_keuangan_id', $bosKategoriIds);
            $judul = "BUKU KAS UMUM - DANA BOS";
        } else {
            // Include non-BOS (Atau if want to include all, maybe conditionally. Usually BKU includes all if general, but for now we separate based on UI). Let's follow UI logic: 'umum' = include all or exclude BOS? UI excluded BOS.
            $query->whereNotIn('kategori_keuangan_id', $bosKategoriIds);
            $judul = "BUKU KAS UMUM";
        }

        $transaksis = $query->get();
        $totalMasuk = $transaksis->where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKeluar = $transaksis->where('tipe_transaksi', 'keluar')->sum('nominal');
        $saldoAkhir = $totalMasuk - $totalKeluar;

        $namaBulan = Carbon::createFromDate($tahun, $bulan, 1)->translatedFormat('F Y');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.bku-pdf', [
            'transaksis' => $transaksis,
            'judul' => $judul,
            'namaBulan' => $namaBulan,
            'totalMasuk' => $totalMasuk,
            'totalKeluar' => $totalKeluar,
            'saldoAkhir' => $saldoAkhir,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_BKU_' . strtoupper($jenis) . '_' . $namaBulan . '.pdf');
    }

    /**
     * Export BKU ke Excel (CSV sederhana)
     */
    public function bkuExcel(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);
        $jenis = $request->get('jenis', 'umum');

        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');
        $query = TransaksiKas::with('kategoriKeuangan')
            ->whereMonth('tanggal_transaksi', $bulan)
            ->whereYear('tanggal_transaksi', $tahun)
            ->orderBy('tanggal_transaksi', 'asc');

        if ($jenis === 'bos') {
            $query->whereIn('kategori_keuangan_id', $bosKategoriIds);
        } else {
            $query->whereNotIn('kategori_keuangan_id', $bosKategoriIds);
        }

        $transaksis = $query->get();
        
        $filename = 'Export_BKU_' . strtoupper($jenis) . '_' . $bulan . '_' . $tahun . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($transaksis) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Tanggal', 'Keterangan', 'Tipe', 'Kategori', 'Debit (Masuk)', 'Kredit (Keluar)']);

            $saldo = 0;
            foreach ($transaksis as $t) {
                $masuk = $t->tipe_transaksi === 'masuk' ? $t->nominal : 0;
                $keluar = $t->tipe_transaksi === 'keluar' ? $t->nominal : 0;
                $saldo += ($masuk - $keluar);
                
                fputcsv($file, [
                    $t->tanggal_transaksi,
                    $t->keterangan ?? '-',
                    strtoupper($t->tipe_transaksi),
                    $t->kategoriKeuangan->nama_kategori ?? '-',
                    $masuk,
                    $keluar
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
