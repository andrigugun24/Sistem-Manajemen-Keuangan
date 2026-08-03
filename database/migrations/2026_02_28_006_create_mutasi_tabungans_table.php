<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mutasi_tabungans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tabungan_id')->constrained('tabungans')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // petugas
            $table->enum('jenis_mutasi', ['setor', 'tarik']);
            $table->integer('nominal');
            $table->string('keperluan')->nullable();
            $table->dateTime('tanggal_mutasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutasi_tabungans');
    }
};
