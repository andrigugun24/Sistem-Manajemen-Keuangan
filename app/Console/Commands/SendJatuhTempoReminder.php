<?php

namespace App\Console\Commands;

use App\Models\Tagihan;
use App\Models\User;
use App\Notifications\SistemNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendJatuhTempoReminder extends Command
{
    protected $signature = 'tagihan:remind-jatuh-tempo';
    protected $description = 'Kirim pengingat untuk tagihan yang mendekati jatuh tempo (H-3)';

    public function handle()
    {
        $targetDate = Carbon::now()->addDays(3)->toDateString();

        $tagihans = Tagihan::with(['siswa', 'kategoriTagihan'])
            ->where('status', '!=', 'lunas')
            ->whereDate('jatuh_tempo', $targetDate)
            ->get();

        if ($tagihans->isEmpty()) {
            $this->info('Tidak ada tagihan mendekati jatuh tempo.');
            return 0;
        }

        $siswaIds = $tagihans->pluck('siswa_id')->unique();

        // Kirim notifikasi ke orang tua
        $orangTuas = User::where('role', 'orang_tua')
            ->whereHas('siswas', fn($q) => $q->whereIn('siswas.id', $siswaIds))
            ->get();

        $notifCount = 0;
        foreach ($orangTuas as $ortu) {
            $anakIds = $ortu->siswas()->whereIn('siswas.id', $siswaIds)->pluck('siswas.id');
            $tagihanAnak = $tagihans->whereIn('siswa_id', $anakIds);

            $totalSisa = $tagihanAnak->sum('sisa_tagihan');
            $jumlahTagihan = $tagihanAnak->count();

            $ortu->notify(new SistemNotification(
                '⏰ Pengingat Jatuh Tempo Tagihan',
                "Anda memiliki {$jumlahTagihan} tagihan sebesar Rp " . number_format($totalSisa, 0, ',', '.') . " yang jatuh tempo dalam 3 hari lagi.",
                'tagihan'
            ));
            $notifCount++;
        }

        // Kirim ke admin juga
        $admins = User::whereIn('role', ['admin', 'bendahara'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new SistemNotification(
                '⏰ Reminder Jatuh Tempo',
                "{$tagihans->count()} tagihan akan jatuh tempo pada " . Carbon::parse($targetDate)->translatedFormat('d M Y') . ".",
                'tagihan'
            ));
        }

        $this->info("Pengingat dikirim: {$notifCount} orang tua, " . $admins->count() . " admin.");
        Log::info("Cron tagihan:remind-jatuh-tempo — {$notifCount} orang tua dikirimi pengingat.");

        return 0;
    }
}
