<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use Illuminate\Http\Request;

class ApiSiswaController extends Controller
{
    /**
     * GET /api/siswa
     * Daftar siswa aktif (paginated).
     */
    public function index(Request $request)
    {
        $query = Siswa::with('kelas')->where('status', 'aktif');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->latest()->paginate($request->get('per_page', 15))
        );
    }

    /**
     * GET /api/siswa/{id}
     * Detail siswa beserta tagihan dan tabungan.
     */
    public function show($id)
    {
        $siswa = Siswa::with(['kelas', 'tabungan'])->findOrFail($id);

        $tagihan = Tagihan::with('kategoriTagihan')
            ->where('siswa_id', $id)
            ->where('status', '!=', 'lunas')
            ->orderBy('jatuh_tempo')
            ->get();

        $pembayaran = Pembayaran::with('detailPembayarans.tagihan.kategoriTagihan')
            ->where('siswa_id', $id)
            ->latest('tanggal_bayar')
            ->take(10)
            ->get();

        return response()->json([
            'siswa' => $siswa,
            'tagihan_aktif' => $tagihan,
            'riwayat_pembayaran' => $pembayaran,
            'saldo_tabungan' => $siswa->tabungan?->saldo ?? 0,
        ]);
    }

    /**
     * GET /api/siswa/{id}/tagihan
     * Tagihan per siswa.
     */
    public function tagihan($id)
    {
        $tagihans = Tagihan::with('kategoriTagihan')
            ->where('siswa_id', $id)
            ->where('status', '!=', 'lunas')
            ->orderBy('jatuh_tempo')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'kategori' => $t->kategoriTagihan?->nama_kategori ?? '-',
                'bulan' => $t->bulan_tagihan ?? '-',
                'nominal' => $t->nominal_tagihan,
                'sisa' => $t->sisa_tagihan,
                'jatuh_tempo' => $t->jatuh_tempo?->format('Y-m-d'),
                'status' => $t->status,
            ]);

        return response()->json($tagihans);
    }

    /**
     * GET /api/siswa/{id}/tabungan
     * Tabungan + riwayat mutasi per siswa.
     */
    public function tabungan($id)
    {
        $tabungan = Tabungan::with('siswa.kelas')
            ->where('siswa_id', $id)
            ->first();

        if (!$tabungan) {
            return response()->json([
                'saldo' => 0,
                'mutasi' => [],
            ]);
        }

        $mutasi = MutasiTabungan::where('tabungan_id', $tabungan->id)
            ->latest('tanggal_mutasi')
            ->take(20)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'jenis' => $m->jenis_mutasi,
                'nominal' => $m->nominal,
                'saldo_sebelum' => $m->saldo_sebelum,
                'saldo_sesudah' => $m->saldo_sesudah,
                'tanggal' => $m->tanggal_mutasi?->format('Y-m-d'),
            ]);

        return response()->json([
            'saldo' => $tabungan->saldo,
            'mutasi' => $mutasi,
        ]);
    }
}
