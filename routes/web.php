<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

// Dashboard - redirect to role-specific dashboard
Route::get('/dashboard', function () {
    $user = auth()->user();
    $role = $user->role ?? 'admin';

    $dashboardMap = [
        'admin' => 'dashboard.admin',
        'bendahara' => 'dashboard.bendahara',
        'kepala_sekolah' => 'dashboard.kepala-sekolah',
        'kepala_yayasan' => 'dashboard.kepala-yayasan',
        'orang_tua' => 'dashboard.orang-tua',
    ];

    $routeName = $dashboardMap[$role] ?? 'dashboard.admin';

    return redirect()->route($routeName);
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-specific dashboards
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard/admin', [\App\Http\Controllers\DashboardController::class, 'admin'])->name('dashboard.admin');
    Route::get('/dashboard/bendahara', [\App\Http\Controllers\DashboardController::class, 'bendahara'])->name('dashboard.bendahara');
    Route::get('/dashboard/kepala-sekolah', [\App\Http\Controllers\DashboardController::class, 'kepalaSekolah'])->name('dashboard.kepala-sekolah');
    Route::get('/dashboard/kepala-yayasan', [\App\Http\Controllers\DashboardController::class, 'kepalaYayasan'])->name('dashboard.kepala-yayasan');
    Route::get('/dashboard/orang-tua', [\App\Http\Controllers\DashboardController::class, 'orangTua'])->name('dashboard.orang-tua');
});

// Data Master (Admin & Kepala Sekolah)
Route::middleware(['auth', 'role:admin,kepala_sekolah'])->prefix('data-master')->group(function () {
    Route::post('siswa/import', [\App\Http\Controllers\SiswaController::class, 'import'])->name('siswa.import');
    Route::resource('siswa', \App\Http\Controllers\SiswaController::class);
    Route::resource('guru', \App\Http\Controllers\GuruController::class);
});

// Data Master (Khusus Admin)
Route::middleware(['auth', 'role:admin'])->prefix('data-master')->group(function () {
    // Profil Sekolah
    Route::get('/profil-sekolah', [\App\Http\Controllers\ProfilSekolahController::class, 'index'])->name('profil-sekolah.index');
    Route::post('/profil-sekolah', [\App\Http\Controllers\ProfilSekolahController::class, 'update'])->name('profil-sekolah.update');

    // CRUD Resources
    Route::resource('kelas', \App\Http\Controllers\KelasController::class);
    Route::resource('tahun-ajaran', \App\Http\Controllers\TahunAjaranController::class);
    Route::resource('kategori-keuangan', \App\Http\Controllers\KategoriKeuanganController::class);
    Route::resource('kategori-tagihan', \App\Http\Controllers\KategoriTagihanController::class);
});

// Keuangan
Route::middleware(['auth', 'role:admin,bendahara'])->prefix('keuangan')->group(function () {
    // Tagihan — full resource
    Route::get('tagihan/batch', [\App\Http\Controllers\TagihanController::class, 'batchDetail'])->name('tagihan.batch');
    Route::resource('tagihan', \App\Http\Controllers\TagihanController::class);

    // Pembayaran
    Route::get('/pembayaran', [\App\Http\Controllers\PembayaranController::class, 'index'])->name('pembayaran.index');
    Route::post('/pembayaran', [\App\Http\Controllers\PembayaranController::class, 'store'])->name('pembayaran.store');
    Route::post('/pembayaran/{pembayaran}/verifikasi', [\App\Http\Controllers\PembayaranController::class, 'verifikasi'])->name('pembayaran.verifikasi');

    // API endpoints (JSON) — untuk pencarian siswa & tagihan dari halaman pembayaran
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('/api/cari-siswa', [\App\Http\Controllers\TagihanController::class, 'cariSiswa'])->name('api.cari-siswa');
        Route::get('/api/tagihan-siswa/{siswa}', [\App\Http\Controllers\TagihanController::class, 'tagihanSiswa'])->name('api.tagihan-siswa');
    });

    Route::get('/verifikasi', [\App\Http\Controllers\PembayaranController::class, 'verifikasiIndex'])->name('verifikasi.index');
    Route::get('/kuitansi/{pembayaran}', [\App\Http\Controllers\PembayaranController::class, 'cetak'])->name('kuitansi.show');
});

// Tabungan
Route::middleware(['auth', 'role:admin,bendahara'])->prefix('tabungan')->group(function () {
    Route::get('/', [\App\Http\Controllers\TabunganController::class, 'index'])->name('tabungan.index');
    Route::get('/setor', [\App\Http\Controllers\TabunganController::class, 'setor'])->name('tabungan.setor');
    Route::post('/setor', [\App\Http\Controllers\TabunganController::class, 'setorStore'])->name('tabungan.setor.store');
    Route::get('/tarik', [\App\Http\Controllers\TabunganController::class, 'tarik'])->name('tabungan.tarik');
    Route::post('/tarik', [\App\Http\Controllers\TabunganController::class, 'tarikStore'])->name('tabungan.tarik.store');
    Route::get('/buku-tabungan', [\App\Http\Controllers\TabunganController::class, 'bukuTabungan'])->name('tabungan.buku');
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('/api/cari-siswa', [\App\Http\Controllers\TabunganController::class, 'cariSiswaTabungan'])->name('api.cari-siswa-tabungan');
    });
});

// Kas
Route::middleware(['auth', 'role:admin,bendahara'])->prefix('kas')->group(function () {
    Route::get('/masuk', [\App\Http\Controllers\TransaksiKasController::class, 'masukIndex'])->name('kas.masuk.index');
    Route::get('/masuk/create', [\App\Http\Controllers\TransaksiKasController::class, 'masukCreate'])->name('kas.masuk.create');
    Route::post('/masuk', [\App\Http\Controllers\TransaksiKasController::class, 'masukStore'])->name('kas.masuk.store');
    Route::get('/keluar', [\App\Http\Controllers\TransaksiKasController::class, 'keluarIndex'])->name('kas.keluar.index');
    Route::get('/keluar/create', [\App\Http\Controllers\TransaksiKasController::class, 'keluarCreate'])->name('kas.keluar.create');
    Route::post('/keluar', [\App\Http\Controllers\TransaksiKasController::class, 'keluarStore'])->name('kas.keluar.store');
    Route::get('/bku', [\App\Http\Controllers\TransaksiKasController::class, 'bkuIndex'])->name('kas.bku');
    Route::get('/bku/pdf', [\App\Http\Controllers\TransaksiKasController::class, 'bkuPdf'])->name('kas.bku.pdf');
    Route::get('/bku/excel', [\App\Http\Controllers\TransaksiKasController::class, 'bkuExcel'])->name('kas.bku.excel');
    Route::get('/gaji', [\App\Http\Controllers\PenggajianController::class, 'index'])->name('kas.gaji.index');
    Route::get('/gaji/slip/{guru}', [\App\Http\Controllers\PenggajianController::class, 'slip'])->name('kas.gaji.slip');
    Route::get('/gaji/pdf/{penggajian}', [\App\Http\Controllers\PenggajianController::class, 'exportSlipPdf'])->name('kas.gaji.pdf');
    Route::get('/gaji/rekap/pdf', [\App\Http\Controllers\PenggajianController::class, 'exportRekapPdf'])->name('kas.gaji.rekap.pdf');
    Route::post('/gaji', [\App\Http\Controllers\PenggajianController::class, 'store'])->name('kas.gaji.store');
    Route::delete('/gaji/{penggajian}', [\App\Http\Controllers\PenggajianController::class, 'destroy'])->name('kas.gaji.destroy');
});

// Laporan
Route::middleware(['auth', 'role:admin,kepala_sekolah,kepala_yayasan,bendahara'])->prefix('laporan')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\LaporanController::class, 'dashboard'])->name('laporan.dashboard');
    Route::get('/keuangan', [\App\Http\Controllers\LaporanController::class, 'keuangan'])->name('laporan.keuangan');
    Route::get('/keuangan/pdf', [\App\Http\Controllers\LaporanController::class, 'exportPdf'])->name('laporan.keuangan.pdf');
    Route::get('/rekap-kategori', [\App\Http\Controllers\LaporanController::class, 'rekapKategori'])->name('laporan.rekap');
    Route::get('/rekap-kategori/pdf', [\App\Http\Controllers\LaporanController::class, 'exportRekapKategoriPdf'])->name('laporan.rekap.pdf');
    Route::get('/tagihan', [\App\Http\Controllers\LaporanController::class, 'tagihan'])->name('laporan.tagihan');
    Route::get('/tagihan/pdf', [\App\Http\Controllers\LaporanController::class, 'exportTagihanPdf'])->name('laporan.tagihan.pdf');
    Route::get('/tabungan/pdf', [\App\Http\Controllers\LaporanController::class, 'exportTabunganPdf'])->name('laporan.tabungan.pdf');
});

// Sistem
Route::middleware(['auth', 'role:admin'])->prefix('sistem')->group(function () {
    Route::resource('pengguna', \App\Http\Controllers\UserController::class);
Route::prefix('log-aktivitas')->name('log.')->group(function () {
        Route::get('/', [\App\Http\Controllers\LogAktivitasController::class, 'index'])->name('index');
        Route::delete('/{logAktivitas}', [\App\Http\Controllers\LogAktivitasController::class, 'destroy'])->name('destroy');
        Route::post('/clear', [\App\Http\Controllers\LogAktivitasController::class, 'clear'])->name('clear');
    });
Route::prefix('backup')->name('backup.')->group(function () {
        Route::get('/', [\App\Http\Controllers\BackupController::class, 'index'])->name('index');
        Route::post('/create', [\App\Http\Controllers\BackupController::class, 'create'])->name('create');
        Route::get('/download/{filename}', [\App\Http\Controllers\BackupController::class, 'download'])->name('download');
        Route::delete('/delete/{filename}', [\App\Http\Controllers\BackupController::class, 'destroy'])->name('destroy');
        Route::post('/restore', [\App\Http\Controllers\BackupController::class, 'restore'])->name('restore');
    });
    
    Route::prefix('notifikasi')->name('notifikasi.')->group(function () {
        Route::get('/', [\App\Http\Controllers\NotifikasiController::class, 'index'])->name('index');
        Route::post('/{id}/read', [\App\Http\Controllers\NotifikasiController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [\App\Http\Controllers\NotifikasiController::class, 'markAllAsRead'])->name('readAll');
    });
});

// Portal Orang Tua
Route::middleware(['auth', 'role:orang_tua'])->prefix('portal')->name('portal.')->group(function () {
    Route::get('/tagihan', [\App\Http\Controllers\PortalOrangTuaController::class, 'tagihan'])->name('tagihan');
    Route::get('/tabungan', [\App\Http\Controllers\PortalOrangTuaController::class, 'tabungan'])->name('tabungan');
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
