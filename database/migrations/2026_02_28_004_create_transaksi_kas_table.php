<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_kas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_keuangan_id')->constrained('kategori_keuangans')->onDelete('cascade');
            $table->enum('tipe_transaksi', ['masuk', 'keluar']);
            $table->integer('nominal');
            $table->text('keterangan')->nullable();
            $table->dateTime('tanggal_transaksi');
            // Polymorphic relation — bisa ke pembayarans, penggajians, dll
            $table->nullableMorphs('referensi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_kas');
    }
};
