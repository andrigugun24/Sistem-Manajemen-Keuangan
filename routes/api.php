<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiDashboardController;
use App\Http\Controllers\Api\ApiSiswaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Jalur komunikasi khusus sistem (API Routes) yang terpisah dari web routes.
| Semua endpoint menggunakan prefix /api secara otomatis.
| Autentikasi menggunakan Laravel Sanctum (token-based).
|
*/

// ------------------------------------------------------------------
// Public Routes (tanpa auth)
// ------------------------------------------------------------------
Route::post('/login', [ApiAuthController::class, 'login'])->name('api.login');

// ------------------------------------------------------------------
// Protected Routes (butuh token Sanctum)
// ------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('api.logout');
    Route::get('/user', [ApiAuthController::class, 'user'])->name('api.user');

    // Dashboard
    Route::get('/dashboard/stats', [ApiDashboardController::class, 'stats'])->name('api.dashboard.stats');

    // Siswa
    Route::get('/siswa', [ApiSiswaController::class, 'index'])->name('api.siswa.index');
    Route::get('/siswa/{id}', [ApiSiswaController::class, 'show'])->name('api.siswa.show');
    Route::get('/siswa/{id}/tagihan', [ApiSiswaController::class, 'tagihan'])->name('api.siswa.tagihan');
    Route::get('/siswa/{id}/tabungan', [ApiSiswaController::class, 'tabungan'])->name('api.siswa.tabungan');
});
