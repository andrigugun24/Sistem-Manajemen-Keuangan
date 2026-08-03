<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TransaksiKas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiDashboardController extends Controller
{
    /**
     * GET /api/dashboard/stats
     * Ringkasan statistik utama untuk dashboard.
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now();

        $totalKasMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKasKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')->sum('nominal');

        return response()->json([
            'saldo_kas' => $totalKasMasuk - $totalKasKeluar,
            'total_pemasukan' => $totalKasMasuk,
            'total_pengeluaran' => $totalKasKeluar,
            'total_siswa_aktif' => Siswa::where('status', 'aktif')->count(),
            'total_guru' => Guru::count(),
            'total_kelas' => Kelas::count(),
            'total_tabungan' => Tabungan::sum('saldo'),
        ]);
    }
}
