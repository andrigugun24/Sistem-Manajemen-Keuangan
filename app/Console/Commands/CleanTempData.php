<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanTempData extends Command
{
    protected $signature = 'system:clean-temp';
    protected $description = 'Bersihkan data sementara (log lama, notifikasi lama, cache)';

    public function handle()
    {
        $cleaned = [];

        // 1. Hapus log aktivitas lebih dari 90 hari
        $deletedLogs = DB::table('log_aktivitas')
            ->where('created_at', '<', Carbon::now()->subDays(90))
            ->delete();
        $cleaned[] = "Log aktivitas: {$deletedLogs} records dihapus";

        // 2. Hapus notifikasi yang sudah dibaca lebih dari 30 hari
        $deletedNotifs = DB::table('notifications')
            ->whereNotNull('read_at')
            ->where('read_at', '<', Carbon::now()->subDays(30))
            ->delete();
        $cleaned[] = "Notifikasi terbaca: {$deletedNotifs} records dihapus";

        // 3. Hapus notifikasi yang belum dibaca lebih dari 60 hari
        $deletedOldNotifs = DB::table('notifications')
            ->where('created_at', '<', Carbon::now()->subDays(60))
            ->delete();
        $cleaned[] = "Notifikasi lama: {$deletedOldNotifs} records dihapus";

        // 4. Bersihkan file cache Laravel
        $this->call('cache:clear');
        $this->call('view:clear');
        $cleaned[] = "Cache & view cleared";

        // 5. Hapus soft-deleted records lebih dari 180 hari
        $tables = ['siswas', 'gurus', 'tagihans', 'pembayarans'];
        foreach ($tables as $table) {
            if (\Schema::hasColumn($table, 'deleted_at')) {
                $deleted = DB::table($table)
                    ->whereNotNull('deleted_at')
                    ->where('deleted_at', '<', Carbon::now()->subDays(180))
                    ->delete();
                if ($deleted > 0) {
                    $cleaned[] = "{$table}: {$deleted} soft-deleted records dihapus permanen";
                }
            }
        }

        foreach ($cleaned as $msg) {
            $this->info($msg);
        }

        Log::info('Cron system:clean-temp — ' . implode(', ', $cleaned));
        return 0;
    }
}
