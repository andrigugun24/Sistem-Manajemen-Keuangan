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
        $tables = ['siswas', 'gurus', 'pembayarans', 'tagihans', 'transaksi_kas', 'penggajians'];

        foreach ($tables as $table) {
            if (!Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $tableScope) {
                    $tableScope->softDeletes();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['siswas', 'gurus', 'pembayarans', 'tagihans', 'transaksi_kas', 'penggajians'];

        foreach ($tables as $table) {
            if (Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $tableScope) {
                    $tableScope->dropSoftDeletes();
                });
            }
        }
    }
};
