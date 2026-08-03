<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            $table->enum('tipe_pegawai', ['guru', 'staff'])->default('guru')->after('instansi');
        });

        Schema::table('penggajians', function (Blueprint $table) {
            $table->json('detail_tunjangan')->nullable()->after('tunjangan');
            $table->json('detail_potongan')->nullable()->after('potongan');
        });
    }

    public function down(): void
    {
        Schema::table('gurus', function (Blueprint $table) {
            $table->dropColumn('tipe_pegawai');
        });

        Schema::table('penggajians', function (Blueprint $table) {
            $table->dropColumn(['detail_tunjangan', 'detail_potongan']);
        });
    }
};
