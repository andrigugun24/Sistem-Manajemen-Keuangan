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
        if (!Schema::hasColumn('siswas', 'foto')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->string('foto')->nullable()->after('status');
            });
        }

        if (!Schema::hasColumn('gurus', 'foto')) {
            Schema::table('gurus', function (Blueprint $table) {
                $table->string('foto')->nullable();
            });
        }

        if (!Schema::hasColumn('pembayarans', 'bukti_transfer')) {
            Schema::table('pembayarans', function (Blueprint $table) {
                $table->string('bukti_transfer')->nullable()->after('tanggal_bayar');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('siswas', 'foto')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->dropColumn('foto');
            });
        }

        if (Schema::hasColumn('gurus', 'foto')) {
            Schema::table('gurus', function (Blueprint $table) {
                $table->dropColumn('foto');
            });
        }

        if (Schema::hasColumn('pembayarans', 'bukti_transfer')) {
            Schema::table('pembayarans', function (Blueprint $table) {
                $table->dropColumn('bukti_transfer');
            });
        }
    }
};
