<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kategori_tagihans', function (Blueprint $table) {
            $table->string('kode_tagihan')->nullable()->after('nama_kategori');
            $table->string('jenis_tagihan')->default('Bulanan')->after('kode_tagihan');
            $table->text('deskripsi')->nullable()->after('nominal_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kategori_tagihans', function (Blueprint $table) {
            $table->dropColumn(['kode_tagihan', 'jenis_tagihan', 'deskripsi']);
        });
    }
};
