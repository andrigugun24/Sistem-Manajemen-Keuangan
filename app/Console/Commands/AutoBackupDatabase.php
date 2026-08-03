<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AutoBackupDatabase extends Command
{
    protected $signature = 'backup:auto-database';
    protected $description = 'Backup database otomatis secara harian';

    public function handle()
    {
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');
        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port', 3306);

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$dbName}_{$timestamp}.sql";
        $backupDir = storage_path('app/backups');

        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $filepath = "{$backupDir}/{$filename}";

        // Cari mysqldump di beberapa lokasi umum
        $mysqldumpPaths = [
            'mysqldump',
            'C:\\wamp64\\bin\\mysql\\mysql8.3.0\\bin\\mysqldump.exe',
            'C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe',
            '/usr/bin/mysqldump',
            '/usr/local/bin/mysqldump',
        ];

        $mysqldump = null;
        foreach ($mysqldumpPaths as $path) {
            if (PHP_OS_FAMILY === 'Windows') {
                $check = shell_exec("where \"{$path}\" 2>nul");
            } else {
                $check = shell_exec("which \"{$path}\" 2>/dev/null");
            }
            if (!empty(trim($check ?? ''))) {
                $mysqldump = $path;
                break;
            }
            // Also check if file exists directly
            if (file_exists($path)) {
                $mysqldump = $path;
                break;
            }
        }

        if (!$mysqldump) {
            $this->error('mysqldump tidak ditemukan. Backup gagal.');
            Log::error('Cron backup:auto — mysqldump not found.');
            return 1;
        }

        $passParam = $dbPass ? "-p\"{$dbPass}\"" : '';
        $command = "\"{$mysqldump}\" -h {$dbHost} -P {$dbPort} -u {$dbUser} {$passParam} {$dbName} > \"{$filepath}\" 2>&1";

        exec($command, $output, $returnCode);

        if ($returnCode === 0 && file_exists($filepath) && filesize($filepath) > 0) {
            $this->info("Backup berhasil: {$filename} (" . round(filesize($filepath) / 1024, 1) . " KB)");
            Log::info("Cron backup:auto — Backup berhasil: {$filename}");

            // Hapus backup lama (simpan 7 terakhir)
            $this->cleanOldBackups($backupDir, 7);

            return 0;
        }

        $this->error("Backup gagal! Return code: {$returnCode}");
        Log::error("Cron backup:auto — Backup gagal, return code: {$returnCode}");
        return 1;
    }

    private function cleanOldBackups(string $dir, int $keepCount): void
    {
        $files = glob("{$dir}/backup_*.sql");
        if (count($files) <= $keepCount) {
            return;
        }

        // Sort by modification time (oldest first)
        usort($files, fn($a, $b) => filemtime($a) - filemtime($b));

        $toDelete = array_slice($files, 0, count($files) - $keepCount);
        foreach ($toDelete as $file) {
            unlink($file);
            Log::info("Cron backup:auto — Old backup deleted: " . basename($file));
        }
    }
}
