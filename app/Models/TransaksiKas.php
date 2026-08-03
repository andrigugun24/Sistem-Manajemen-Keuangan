<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransaksiKas extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'transaksi_kas';

    protected $fillable = [
        'kategori_keuangan_id',
        'tipe_transaksi',
        'nominal',
        'keterangan',
        'tanggal_transaksi',
        'referensi_type',
        'referensi_id',
    ];

    protected $casts = [
        'tanggal_transaksi' => 'datetime',
    ];

    public function kategoriKeuangan()
    {
        return $this->belongsTo(KategoriKeuangan::class);
    }

    /**
     * Polymorphic relation — bisa mengarah ke Pembayaran, Penggajian, dll.
     */
    public function referensi()
    {
        return $this->morphTo();
    }
}
