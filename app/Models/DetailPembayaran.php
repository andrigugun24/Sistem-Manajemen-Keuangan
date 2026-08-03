<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailPembayaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'pembayaran_id',
        'tagihan_id',
        'nominal_bayar',
    ];

    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class);
    }

    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class);
    }
}
