<?php

namespace App\Console\Commands;

use App\Models\Tagihan;
use App\Models\Siswa;
use App\Models\KategoriTagihan;
use App\Models\TahunAjaran;
use App\Models\User;
use App\Notifications\SistemNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyTagihan extends Command
{
    protected $signature = 'tagihan:generate-monthly';
    protected $description = 'Auto-generate tagihan SPP bulanan setiap tanggal 1';

    public function handle()
    {
        $now = Carbon::now();
        $bulanIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $tahunAjaran = TahunAjaran::where('aktif', true)->first();
        if (!$tahunAjaran) {
            $this->warn('Tidak ada tahun ajaran aktif, lewati pembuatan tagihan.');
            return 0;
        }

        // Cari kategori tagihan yang bertipe SPP/bulanan
        $kategoriSPP = KategoriTagihan::where('nama_kategori', 'like', '%SPP%')->first();
        if (!$kategoriSPP) {
            $this->warn('Tidak ada kategori tagihan SPP, lewati pembuatan tagihan.');
            return 0;
        }

        $bulanStr = $bulanIndo[$now->month] . ' ' . $now->year;
        $nominal = $kategoriSPP->nominal_default ?? 0;

        $siswaAktif = Siswa::where('status', 'aktif')->pluck('id');

        if ($siswaAktif->isEmpty()) {
            $this->info('Tidak ada siswa aktif.');
            return 0;
        }

        $created = 0;
        $skipped = 0;

        DB::transaction(function () use ($siswaAktif, $kategoriSPP, $tahunAjaran, $bulanStr, $nominal, $now, &$created, &$skipped) {
            foreach ($siswaAktif as $siswaId) {
                $exists = Tagihan::where('siswa_id', $siswaId)
                    ->where('kategori_tagihan_id', $kategoriSPP->id)
                    ->where('tahun_ajaran_id', $tahunAjaran->id)
                    ->where('bulan_tagihan', $bulanStr)
                    ->exists();

                if ($exists) {
                    $skipped++;
                    continue;
                }

                Tagihan::create([
                    'siswa_id' => $siswaId,
                    'kategori_tagihan_id' => $kategoriSPP->id,
                    'tahun_ajaran_id' => $tahunAjaran->id,
                    'bulan_tagihan' => $bulanStr,
                    'target_kelas' => 'semua',
                    'nominal_tagihan' => $nominal,
                    'sisa_tagihan' => $nominal,
                    'status' => 'belum_lunas',
                    'jatuh_tempo' => Carbon::create($now->year, $now->month, 10)->format('Y-m-d'),
                ]);

                $created++;
            }
        });

        // Notifikasi ke admin
        if ($created > 0) {
            $admins = User::whereIn('role', ['admin', 'bendahara'])->get();
            foreach ($admins as $admin) {
                $admin->notify(new SistemNotification(
                    'Tagihan Otomatis Dibuat',
                    "Tagihan SPP {$bulanStr} berhasil digenerate otomatis untuk {$created} siswa. ({$skipped} dilewati karena sudah ada)",
                    'tagihan'
                ));
            }
        }

        $this->info("Tagihan {$bulanStr}: {$created} dibuat, {$skipped} dilewati.");
        Log::info("Cron tagihan:generate-monthly — {$created} dibuat, {$skipped} dilewati.");

        return 0;
    }
}
