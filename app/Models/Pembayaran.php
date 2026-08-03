<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pembayaran extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'no_referensi',
        'siswa_id',
        'user_id',
        'total_bayar',
        'metode_pembayaran',
        'status_pembayaran',
        'tanggal_bayar',
        'bukti_transfer',
    ];

    protected $casts = [
        'tanggal_bayar' => 'datetime',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detailPembayarans()
    {
        return $this->hasMany(DetailPembayaran::class);
    }

    /**
     * Polymorphic: transaksi kas yang terkait pembayaran ini.
     */
    public function transaksiKas()
    {
        return $this->morphMany(TransaksiKas::class, 'referensi');
    }
}
