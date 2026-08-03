<?php

namespace App\Http\Controllers;

use App\Models\Penggajian;
use App\Models\Guru;
use App\Models\TransaksiKas;
use App\Models\KategoriKeuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\AktivitasService;

class PenggajianController extends Controller
{
    public function index(Request $request)
    {
        $bulan = (int) $request->get('bulan', Carbon::now()->month);
        $tahun = (int) $request->get('tahun', Carbon::now()->year);
        $periodeBulan = $bulan . '-' . $tahun;

        $gurus = Guru::orderBy('nama_guru')->get();

        $dataPegawai = $gurus->map(function ($guru) use ($periodeBulan) {
            $gaji = Penggajian::where('guru_id', $guru->id)
                ->where('periode_bulan', $periodeBulan)
                ->first();

            return [
                'id' => $guru->id,
                'nip' => $guru->nip ?? '-',
                'nama' => $guru->nama_guru,
                'instansi' => $guru->instansi,
                'statusGaji' => $gaji ? 'sudah_dibayar' : 'belum_dibayar',
                'nominal' => $gaji?->total_gaji ?? 0,
                'tanggalBayar' => $gaji?->tanggal_pembayaran?->translatedFormat('d M Y'),
                'penggajian_id' => $gaji?->id,
            ];
        });

        $totalPegawai = $gurus->count();
        $sudahDibayar = $dataPegawai->where('statusGaji', 'sudah_dibayar')->count();
        $nominalTerbayar = $dataPegawai->where('statusGaji', 'sudah_dibayar')->sum('nominal');

        return Inertia::render('Kas/GajiGuru/Index', [
            'dataPegawai' => $dataPegawai,
            'stats' => [
                'totalPegawai' => $totalPegawai,
                'sudahDibayar' => $sudahDibayar,
                'nominalTerbayar' => $nominalTerbayar,
                'estimasiBeban' => $nominalTerbayar,
            ],
            'filters' => [
                'bulan' => (int) $bulan,
                'tahun' => (int) $tahun,
            ],
        ]);
    }

    public function slip(Request $request, $guruId)
    {
        $guru = Guru::findOrFail($guruId);
        $bulan = (int) $request->get('bulan', Carbon::now()->month);
        $tahun = (int) $request->get('tahun', Carbon::now()->year);
        $periodeBulan = $bulan . '-' . $tahun;

        $gaji = Penggajian::where('guru_id', $guruId)
            ->where('periode_bulan', $periodeBulan)
            ->first();

        // Dana BOS: calculate from categories with 'BOS' in the name
        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');
        $bosMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $bosKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $saldoBOS = $bosMasuk - $bosKeluar;

        // Kas Umum: ALL transactions EXCLUDING BOS categories
        $umumMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereNotIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $umumKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereNotIn('kategori_keuangan_id', $bosKategoriIds)
            ->sum('nominal');
        $saldoUmum = $umumMasuk - $umumKeluar;

        return Inertia::render('Kas/GajiGuru/Slip', [
            'guru' => $guru,
            'gaji' => $gaji,
            'saldoKas' => [
                'umum' => $saldoUmum,
                'bos' => $saldoBOS,
            ],
            'filters' => [
                'bulan' => (int) $bulan,
                'tahun' => (int) $tahun,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:gurus,id',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020',
            'gaji_pokok' => 'required|integer|min:0',
            'tunjangan' => 'nullable|integer|min:0',
            'potongan' => 'nullable|integer|min:0',
            'detail_tunjangan' => 'nullable|array',
            'detail_potongan' => 'nullable|array',
            'jenis_kas' => 'nullable|string|in:umum,bos',
        ]);

        $periodeBulan = (int)$validated['bulan'] . '-' . (int)$validated['tahun'];

        $exists = Penggajian::where('guru_id', $validated['guru_id'])
            ->where('periode_bulan', $periodeBulan)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Gaji untuk guru dan periode ini sudah pernah diproses.');
        }

        $totalGaji = $validated['gaji_pokok'] + ($validated['tunjangan'] ?? 0) - ($validated['potongan'] ?? 0);

        DB::transaction(function () use ($validated, $totalGaji, $periodeBulan) {
            $guru = Guru::findOrFail($validated['guru_id']);

            $penggajian = Penggajian::create([
                'guru_id' => $validated['guru_id'],
                'periode_bulan' => $periodeBulan,
                'gaji_pokok' => $validated['gaji_pokok'],
                'tunjangan' => $validated['tunjangan'] ?? 0,
                'potongan' => $validated['potongan'] ?? 0,
                'detail_tunjangan' => $validated['detail_tunjangan'] ?? [],
                'detail_potongan' => $validated['detail_potongan'] ?? [],
                'total_gaji' => $totalGaji,
                'status' => 'dibayar',
                'tanggal_pembayaran' => now(),
            ]);

            // Use correct category based on jenis_kas selection
            $jenisKas = $validated['jenis_kas'] ?? 'umum';
            if ($jenisKas === 'bos') {
                $kategori = KategoriKeuangan::firstOrCreate(
                    ['nama_kategori' => 'Gaji Guru (BOS)'],
                    ['jenis' => 'Pengeluaran']
                );
            } else {
                $kategori = KategoriKeuangan::firstOrCreate(
                    ['nama_kategori' => 'Gaji Guru'],
                    ['jenis' => 'Pengeluaran']
                );
            }

            TransaksiKas::create([
                'kategori_keuangan_id' => $kategori->id,
                'tipe_transaksi' => 'keluar',
                'nominal' => $totalGaji,
                'keterangan' => "Gaji {$guru->nama_guru} — Periode {$periodeBulan}",
                'tanggal_transaksi' => now(),
                'referensi_type' => Penggajian::class,
                'referensi_id' => $penggajian->id,
            ]);
        });

        AktivitasService::catat('Proses Gaji', 'App\Models\Penggajian', $validated['guru_id'], null, [
            'periode' => $periodeBulan,
            'total_gaji' => $totalGaji,
        ]);

        return redirect()->route('kas.gaji.index')->with('success', 'Gaji berhasil diproses dan dicatat ke kas keluar.');
    }

    /**
     * Cetak Slip Gaji PDF untuk satu penggajian.
     */
    public function exportSlipPdf($penggajianId)
    {
        $penggajian = Penggajian::with('guru')->findOrFail($penggajianId);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.slip-gaji-pdf', [
            'penggajian' => $penggajian,
            'guru' => $penggajian->guru,
            'user' => auth()->user(),
        ])->setPaper('a5', 'landscape'); // A5 landscape

        $namaGuru = $penggajian->guru ? $penggajian->guru->nama_guru : 'Pegawai';
        return $pdf->download('Slip_Gaji_' . str_replace(' ', '_', $namaGuru) . '_' . $penggajian->periode_bulan . '.pdf');
    }

    /**
     * Cetak Rekap Gaji PDF untuk semua pegawai satu periode.
     */
    public function exportRekapPdf(Request $request)
    {
        $bulan = (int) $request->get('bulan', Carbon::now()->month);
        $tahun = (int) $request->get('tahun', Carbon::now()->year);
        $periodeBulan = $bulan . '-' . $tahun;

        $penggajians = Penggajian::with('guru')
            ->where('periode_bulan', $periodeBulan)
            ->orderBy('created_at', 'asc')
            ->get();

        $totalGaji = $penggajians->sum('total_gaji');

        $namaBulan = Carbon::createFromDate($tahun, $bulan, 1)->translatedFormat('F Y');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.rekap-gaji-pdf', [
            'penggajians' => $penggajians,
            'totalGaji' => $totalGaji,
            'namaBulan' => $namaBulan,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Rekap_Gaji_' . $namaBulan . '.pdf');
    }

    /**
     * Membatalkan/menghapus penggajian yang sudah diproses.
     */
    public function destroy($id)
    {
        $penggajian = Penggajian::findOrFail($id);

        DB::transaction(function () use ($penggajian) {
            // Hapus transaksi kas yang terkait
            $penggajian->transaksiKas()->delete();

            // Hapus data penggajian
            $penggajian->delete();
        });

        AktivitasService::catat('Batal Gaji', 'App\Models\Penggajian', $penggajian->guru_id, null, [
            'periode' => $penggajian->periode_bulan,
            'total_gaji' => $penggajian->total_gaji
        ]);

        return redirect()->route('kas.gaji.index')->with('success', 'Gaji berhasil dibatalkan. Saldo kas telah dikembalikan.');
    }
}
