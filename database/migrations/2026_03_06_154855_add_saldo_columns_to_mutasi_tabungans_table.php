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
        Schema::table('mutasi_tabungans', function (Blueprint $table) {
            $table->integer('saldo_sebelum')->after('nominal')->default(0);
            $table->integer('saldo_sesudah')->after('saldo_sebelum')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutasi_tabungans', function (Blueprint $table) {
            $table->dropColumn(['saldo_sebelum', 'saldo_sesudah']);
        });
    }
};
