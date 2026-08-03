<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\Tabungan;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalOrangTuaController extends Controller
{
    public function tagihan(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'orang_tua') {
            abort(403, 'Unauthorized.');
        }

        $anakIds = $user->siswas()->pluck('siswas.id');
        $siswas = $user->siswas()->get(['siswas.id', 'nama_lengkap', 'nisn']);

        $tagihans = Tagihan::with(['siswa.kelas', 'kategoriTagihan'])
            ->whereIn('siswa_id', $anakIds)
            ->latest('jatuh_tempo')
            ->paginate(20)
            ->withQueryString();

        // Riwayat pembayaran anak
        $pembayarans = Pembayaran::with(['siswa', 'detailPembayarans.tagihan.kategoriTagihan'])
            ->whereIn('siswa_id', $anakIds)
            ->latest('tanggal_bayar')
            ->limit(20)
            ->get();

        return Inertia::render('Portal/Tagihan', [
            'tagihans' => $tagihans,
            'pembayarans' => $pembayarans,
            'siswas' => $siswas,
        ]);
    }

    public function tabungan(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'orang_tua') {
            abort(403, 'Unauthorized.');
        }

        $anakIds = $user->siswas()->pluck('siswas.id');
        $siswas = $user->siswas()->get(['siswas.id', 'nama_lengkap', 'nisn']);

        $tabungans = Tabungan::with(['siswa.kelas', 'mutasiTabungans' => function ($q) {
                $q->latest('tanggal_mutasi')->limit(50);
            }])
            ->whereIn('siswa_id', $anakIds)
            ->get();

        return Inertia::render('Portal/Tabungan', [
            'tabungans' => $tabungans,
            'siswas' => $siswas,
        ]);
    }
}
