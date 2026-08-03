<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CleanDummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();

        // Data Transaksi & Keuangan
        if (Schema::hasTable('detail_pembayarans')) DB::table('detail_pembayarans')->truncate();
        if (Schema::hasTable('pembayarans')) DB::table('pembayarans')->truncate();
        if (Schema::hasTable('tagihans')) DB::table('tagihans')->truncate();
        if (Schema::hasTable('mutasi_tabungans')) DB::table('mutasi_tabungans')->truncate();
        if (Schema::hasTable('tabungans')) DB::table('tabungans')->truncate();
        if (Schema::hasTable('transaksi_kas')) DB::table('transaksi_kas')->truncate();
        if (Schema::hasTable('penggajians')) DB::table('penggajians')->truncate();
        if (Schema::hasTable('log_aktivitas')) DB::table('log_aktivitas')->truncate();

        // Data Master yang mau dibersihkan
        if (Schema::hasTable('siswas')) DB::table('siswas')->truncate();
        if (Schema::hasTable('kelas')) DB::table('kelas')->truncate();
        if (Schema::hasTable('gurus')) DB::table('gurus')->truncate(); 

        Schema::enableForeignKeyConstraints();

        $this->command->info('Semua data transaksi dan master uji coba telah berhasil dibersihkan.');
    }
}
