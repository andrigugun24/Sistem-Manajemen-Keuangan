<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('kategori_tagihan_id')->constrained('kategori_tagihans')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajarans')->onDelete('cascade');
            $table->string('bulan_tagihan')->nullable(); // e.g. 'Juli 2026'
            $table->integer('nominal_tagihan');
            $table->integer('sisa_tagihan');
            $table->enum('status', ['lunas', 'sebagian', 'belum_lunas'])->default('belum_lunas');
            $table->date('jatuh_tempo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
