<?php

namespace App\Http\Controllers;

use App\Models\TransaksiKas;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Tabungan;
use App\Models\Penggajian;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\User;
use App\Models\KategoriKeuangan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Dashboard Admin — statistik umum sekolah.
     */
    public function admin()
    {
        $totalSiswa = Siswa::where('status', 'aktif')->count();
        $totalGuru = Guru::count();
        $totalKelas = Kelas::count();
        $totalPengguna = User::count();

        $recentActivities = LogAktivitas::with('user')
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                $type = 'info';
                $actionStr = strtolower($log->action ?? '');
                
                if (str_contains($actionStr, 'hapus') || str_contains($actionStr, 'delete')) $type = 'danger';
                elseif (str_contains($actionStr, 'tambah') || str_contains($actionStr, 'create') || str_contains($actionStr, 'berhasil')) $type = 'success';
                
                $modelName = $log->model_type ? str_replace('App\\Models\\', '', $log->model_type) : '';
                
                return [
                    'id' => $log->id,
                    'user' => $log->user ? $log->user->name : 'Sistem',
                    'action' => $log->action,
                    'target' => $modelName,
                    'time' => $log->created_at->translatedFormat('d M Y, H:i') . ' WIB',
                    'type' => $type,
                ];
            });

        $tahunAjaran = \App\Models\TahunAjaran::where('aktif', true)->first();
        $tahunAjaranNama = $tahunAjaran ? $tahunAjaran->nama_tahun_ajaran : 'Belum diatur';

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
                'totalKelas' => $totalKelas,
                'totalPengguna' => $totalPengguna,
            ],
            'recentActivities' => $recentActivities,
            'tahunAjaran' => $tahunAjaranNama,
        ]);
    }

    /**
     * Dashboard Bendahara — real data aggregation.
     */
    public function bendahara()
    {
        $now = Carbon::now();

        $totalKasMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKasKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')->sum('nominal');
        $saldoKas = $totalKasMasuk - $totalKasKeluar;
        $totalTabungan = Tabungan::sum('saldo');

        $bulanLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartData = [];

        for ($m = 1; $m <= 12; $m++) {
            $masuk = TransaksiKas::where('tipe_transaksi', 'masuk')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $now->year)
                ->sum('nominal');
            $keluar = TransaksiKas::where('tipe_transaksi', 'keluar')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $now->year)
                ->sum('nominal');

            $chartData[] = [
                'month' => $bulanLabels[$m - 1],
                'masuk' => round($masuk / 1000000, 1),
                'keluar' => round($keluar / 1000000, 1),
            ];
        }

        $aktivitasTerbaru = TransaksiKas::with('kategoriKeuangan')
            ->latest('tanggal_transaksi')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'tipe' => $t->tipe_transaksi,
                'kategori' => $t->kategoriKeuangan?->nama_kategori ?? '-',
                'keterangan' => $t->keterangan,
                'nominal' => $t->nominal,
                'waktu' => $t->tanggal_transaksi->diffForHumans(),
            ]);

        $tagihanBelumLunas = Tagihan::with(['siswa.kelas', 'kategoriTagihan'])
            ->where('status', '!=', 'lunas')
            ->orderBy('jatuh_tempo')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'siswa' => $t->siswa?->nama_lengkap ?? 'Siswa Terhapus',
                'kelas' => $t->siswa?->kelas?->nama_kelas ?? '-',
                'jenis' => ($t->kategoriTagihan?->nama_kategori ?? '-') . ($t->bulan_tagihan ? " ({$t->bulan_tagihan})" : ''),
                'nominal' => $t->sisa_tagihan,
                'jatuhTempo' => $t->jatuh_tempo ? \Carbon\Carbon::parse($t->jatuh_tempo)->translatedFormat('d M Y') : '-',
                'status' => $t->status,
            ]);

        return Inertia::render('Dashboard/BendaharaDashboard', [
            'stats' => [
                'totalKasMasuk' => $totalKasMasuk,
                'totalKasKeluar' => $totalKasKeluar,
                'saldoKas' => $saldoKas,
                'totalTabungan' => $totalTabungan,
            ],
            'chartData' => $chartData,
            'aktivitasTerbaru' => $aktivitasTerbaru,
            'tagihanBelumLunas' => $tagihanBelumLunas,
        ]);
    }

    /**
     * Dashboard Kepala Sekolah — ringkasan kinerja keuangan.
     */
    public function kepalaSekolah()
    {
        $now = Carbon::now();

        $totalKasMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKasKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')->sum('nominal');
        $saldoKas = $totalKasMasuk - $totalKasKeluar;

        $totalTagihan = Tagihan::sum('nominal_tagihan');
        $totalLunas = Tagihan::where('status', 'lunas')->sum('nominal_tagihan');
        $kepatuhan = $totalTagihan > 0 ? round(($totalLunas / $totalTagihan) * 100, 1) : 0;

        $totalSiswa = Siswa::where('status', 'aktif')->count();
        $totalGuru = Guru::count();

        // 1. Monthly Data for "Pemasukan vs Pengeluaran" Chart
        $bulanLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        $monthlyData = [];
        for ($m = 1; $m <= 12; $m++) {
            $masuk = TransaksiKas::where('tipe_transaksi', 'masuk')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $now->year)
                ->sum('nominal');
            $keluar = TransaksiKas::where('tipe_transaksi', 'keluar')
                ->whereMonth('tanggal_transaksi', $m)
                ->whereYear('tanggal_transaksi', $now->year)
                ->sum('nominal');

            $monthlyData[] = [
                'bulan' => $bulanLabels[$m - 1],
                'masuk' => round($masuk / 1000000, 1),
                'keluar' => round($keluar / 1000000, 1),
            ];
        }

        // 2. Realisasi Dana BOS
        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');
        $bosMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->whereYear('tanggal_transaksi', $now->year)
            ->sum('nominal');
        $bosKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')
            ->whereIn('kategori_keuangan_id', $bosKategoriIds)
            ->whereYear('tanggal_transaksi', $now->year)
            ->sum('nominal');

        $bosData = [
            'totalDiterima' => $bosMasuk,
            'terpakai' => $bosKeluar,
            'sisa' => $bosMasuk - $bosKeluar
        ];

        // 3. Distribusi Kapasitas Kelas
        $kelasGroups = Siswa::where('status', 'aktif')
            ->join('kelas', 'siswas.kelas_id', '=', 'kelas.id')
            ->select('kelas.nama_kelas', DB::raw('count(*) as total'))
            ->groupBy('kelas.id', 'kelas.nama_kelas')
            ->orderBy('total', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'nama' => $item->nama_kelas,
                    'jumlah' => $item->total
                ];
            });

        return Inertia::render('Dashboard/KepalaSekolahDashboard', [
            'stats' => [
                'saldoKas' => $saldoKas,
                'totalPemasukan' => $totalKasMasuk,
                'totalPengeluaran' => $totalKasKeluar,
                'kepatuhanSPP' => $kepatuhan,
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
            ],
            'monthlyData' => $monthlyData,
            'bosData' => $bosData,
            'kapasitasData' => $kelasGroups
        ]);
    }

    /**
     * Dashboard Kepala Yayasan — ringkasan eksekutif.
     */
    public function kepalaYayasan()
    {
        $now = Carbon::now();
        $totalKasMasuk = TransaksiKas::where('tipe_transaksi', 'masuk')->sum('nominal');
        $totalKasKeluar = TransaksiKas::where('tipe_transaksi', 'keluar')->sum('nominal');
        $saldoKas = $totalKasMasuk - $totalKasKeluar;

        $totalTagihan = Tagihan::sum('nominal_tagihan');
        $totalLunas = Tagihan::where('status', 'lunas')->sum('nominal_tagihan');
        $tunggakan = $totalTagihan - $totalLunas;

        $totalSiswa = Siswa::where('status', 'aktif')->count();
        $totalGuru = Guru::count();

        // 1. Distribusi Sumber Dana (Pemasukan)
        $bosKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%BOS%')->pluck('id');
        $sppKategoriIds = KategoriKeuangan::where('nama_kategori', 'like', '%SPP%')->pluck('id');

        $bosIncome = TransaksiKas::where('tipe_transaksi', 'masuk')->whereIn('kategori_keuangan_id', $bosKategoriIds)->sum('nominal');
        $sppIncome = TransaksiKas::where('tipe_transaksi', 'masuk')->whereIn('kategori_keuangan_id', $sppKategoriIds)->sum('nominal');
        
        // Asumsikan donasi = dari kategori dengan nama donasi/hibah, jika tidak ada, 0
        $donasiIds = KategoriKeuangan::where('nama_kategori', 'like', '%Donasi%')->orWhere('nama_kategori', 'like', '%Hibah%')->pluck('id');
        $donasiIncome = TransaksiKas::where('tipe_transaksi', 'masuk')->whereIn('kategori_keuangan_id', $donasiIds)->sum('nominal');
        
        $lainnyaIncome = $totalKasMasuk - ($bosIncome + $sppIncome + $donasiIncome);

        $fundDistribution = [];
        if ($totalKasMasuk > 0) {
            $fundDistribution = [
                ['name' => 'Dana BOS', 'value' => round(($bosIncome / $totalKasMasuk) * 100), 'color' => '#6366f1'],
                ['name' => 'SPP & Iuran', 'value' => round(($sppIncome / $totalKasMasuk) * 100), 'color' => '#10b981'],
                ['name' => 'Donasi & Hibah', 'value' => round(($donasiIncome / $totalKasMasuk) * 100), 'color' => '#f59e0b'],
                ['name' => 'Lainnya', 'value' => round(($lainnyaIncome / $totalKasMasuk) * 100), 'color' => '#8b5cf6'],
            ];
            // Filter out 0%
            $fundDistribution = array_filter($fundDistribution, fn($i) => $i['value'] > 0);
        }

        // 2. Performa Per Unit
        $instansis = Siswa::whereNotNull('instansi')->groupBy('instansi')->pluck('instansi');
        $performaUnit = [];

        foreach ($instansis as $instansi) {
            $siswaCount = Siswa::where('status', 'aktif')->where('instansi', $instansi)->count();
            
            // Pemasukan dari Pembayaran Tagihan per Instansi
            $pemasukanUnit = DB::table('detail_pembayarans')
                ->join('pembayarans', 'detail_pembayarans.pembayaran_id', '=', 'pembayarans.id')
                ->join('tagihans', 'detail_pembayarans.tagihan_id', '=', 'tagihans.id')
                ->join('siswas', 'tagihans.siswa_id', '=', 'siswas.id')
                ->where('siswas.instansi', $instansi)
                ->where('pembayarans.status_pembayaran', 'berhasil')
                ->whereYear('pembayarans.tanggal_bayar', $now->year)
                ->sum('detail_pembayarans.nominal_bayar');
                
            $targetUnit = Tagihan::join('siswas', 'tagihans.siswa_id', '=', 'siswas.id')
                ->where('siswas.instansi', $instansi)
                ->whereYear('tagihans.jatuh_tempo', $now->year)
                ->sum('tagihans.nominal_tagihan');

            $progress = $targetUnit > 0 ? round(($pemasukanUnit / $targetUnit) * 100) : 0;
            $status = $progress >= 80 ? 'Baik' : ($progress >= 50 ? 'Sedang' : 'Perlu Perhatian');

            $performaUnit[] = [
                'unit' => $instansi . ' Yayasan',
                'siswa' => $siswaCount,
                'pemasukan' => $pemasukanUnit,
                'status' => $status,
                'progress' => $progress
            ];
        }

        return Inertia::render('Dashboard/KepalaYayasanDashboard', [
            'stats' => [
                'saldoKas' => $saldoKas,
                'totalPemasukan' => $totalKasMasuk,
                'totalPengeluaran' => $totalKasKeluar,
                'totalTunggakan' => $tunggakan,
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
            ],
            'fundDistribution' => array_values($fundDistribution),
            'performaUnit' => $performaUnit
        ]);
    }

    /**
     * Dashboard Orang Tua — tagihan & tabungan anak.
     */
    public function orangTua()
    {
        $user = auth()->user();
        
        // Ambil semua siswa yang terhubung dengan orang tua ini
        $siswas = $user->siswas()
            ->with(['kelas', 'tabungan.mutasiTabungans', 'tagihans' => function($q) {
                $q->where('status', '!=', 'lunas')->orderBy('jatuh_tempo')->with('kategoriTagihan');
            }])
            ->get()
            ->map(function ($siswa) {
                // Get pembayarans
                $pembayarans = \App\Models\Pembayaran::with('detailPembayarans.tagihan.kategoriTagihan')
                    ->where('siswa_id', $siswa->id)
                    ->orderBy('tanggal_bayar', 'desc')
                    ->limit(10)
                    ->get();
                
                $riwayatPembayaran = $pembayarans->map(function ($p) {
                    $jenis = 'Tagihan';
                    if ($p->detailPembayarans->isNotEmpty() && $p->detailPembayarans->first()->tagihan) {
                        $jenis = $p->detailPembayarans->first()->tagihan->kategoriTagihan->nama_kategori;
                        if ($p->detailPembayarans->count() > 1) {
                            $jenis .= ' + ' . ($p->detailPembayarans->count() - 1) . ' lainnya';
                        }
                    }

                    return [
                        'id' => $p->id,
                        'jenis' => $jenis,
                        'metode' => ucfirst($p->metode_pembayaran),
                        'nominal' => $p->total_bayar,
                        'tanggalBayar' => $p->tanggal_bayar->translatedFormat('d M Y H:i'),
                        'status' => $p->status_pembayaran
                    ];
                });

                $riwayatTabungan = [];
                if ($siswa->tabungan && $siswa->tabungan->mutasiTabungans) {
                    $riwayatTabungan = $siswa->tabungan->mutasiTabungans
                        ->sortByDesc('tanggal_mutasi')
                        ->take(10)
                        ->values()
                        ->map(function ($m) {
                            return [
                                'id' => $m->id,
                                'tanggal' => $m->tanggal_mutasi->translatedFormat('d M Y'),
                                'keterangan' => $m->jenis_mutasi === 'setor' ? 'Setoran Tabungan' : 'Penarikan Tabungan',
                                'nominal' => $m->nominal,
                                'type' => $m->jenis_mutasi === 'setor' ? 'in' : 'out',
                                'status' => 'Berhasil'
                            ];
                        });
                }

                return [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nisn' => $siswa->nisn,
                    'instansi' => $siswa->instansi,
                    'kelas' => $siswa->kelas?->nama_kelas ?? '-',
                    'saldo_tabungan' => $siswa->tabungan?->saldo ?? 0,
                    'tagihan_aktif' => $siswa->tagihans->map(fn($t) => [
                        'id' => $t->id,
                        'jenis' => $t->kategoriTagihan?->nama_kategori . ($t->bulan_tagihan ? " ({$t->bulan_tagihan})" : ''),
                        'nominal' => $t->sisa_tagihan,
                        'jatuh_tempo' => $t->jatuh_tempo->translatedFormat('d M Y'),
                        'status' => $t->status,
                    ]),
                    'total_tunggakan' => $siswa->tagihans->sum('sisa_tagihan'),
                    'riwayat_pembayaran' => $riwayatPembayaran,
                    'riwayat_tabungan' => $riwayatTabungan,
                ];
            });

        return Inertia::render('Dashboard/OrangTuaDashboard', [
            'siswas' => $siswas,
        ]);
    }
}
