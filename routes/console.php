<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Jadwal Otomatis (Cron Jobs)
|--------------------------------------------------------------------------
|
| Untuk menjalankan jadwal ini, tambahkan entry cron berikut di server:
| * * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
|
| Pada Windows (Task Scheduler), jalankan setiap menit:
| php artisan schedule:run
|
*/

// 1. Generate tagihan SPP otomatis setiap tanggal 1 pukul 00:05
Schedule::command('tagihan:generate-monthly')
    ->monthlyOn(1, '00:05')
    ->withoutOverlapping()
    ->onOneServer()
    ->appendOutputTo(storage_path('logs/cron-tagihan.log'));

// 2. Kirim pengingat jatuh tempo setiap hari pukul 08:00
Schedule::command('tagihan:remind-jatuh-tempo')
    ->dailyAt('08:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/cron-reminder.log'));

// 3. Backup database otomatis setiap hari pukul 02:00
Schedule::command('backup:auto-database')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/cron-backup.log'));

// 4. Bersihkan data sementara setiap minggu (Minggu pukul 03:00)
Schedule::command('system:clean-temp')
    ->weeklyOn(0, '03:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/cron-cleanup.log'));
