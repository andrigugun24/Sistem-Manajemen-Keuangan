<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penggajians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->string('periode_bulan'); // e.g. 'Februari 2026'
            $table->integer('gaji_pokok')->default(0);
            $table->integer('tunjangan')->default(0);
            $table->integer('potongan')->default(0);
            $table->integer('total_gaji')->default(0);
            $table->enum('status', ['draft', 'dibayar'])->default('draft');
            $table->date('tanggal_pembayaran')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penggajians');
    }
};
