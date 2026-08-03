<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Penggajian extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'guru_id',
        'periode_bulan',
        'gaji_pokok',
        'tunjangan',
        'potongan',
        'detail_tunjangan',
        'detail_potongan',
        'total_gaji',
        'status',
        'tanggal_pembayaran',
    ];

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'detail_tunjangan' => 'array',
        'detail_potongan' => 'array',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    /**
     * Polymorphic: transaksi kas yang terkait penggajian ini.
     */
    public function transaksiKas()
    {
        return $this->morphMany(TransaksiKas::class, 'referensi');
    }
}
