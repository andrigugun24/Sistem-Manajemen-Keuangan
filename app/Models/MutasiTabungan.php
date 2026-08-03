<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutasiTabungan extends Model
{
    use HasFactory;

    protected $fillable = [
        'tabungan_id',
        'user_id',
        'jenis_mutasi',
        'nominal',
        'saldo_sebelum',
        'saldo_sesudah',
        'keperluan',
        'tanggal_mutasi',
    ];

    protected $casts = [
        'tanggal_mutasi' => 'datetime',
    ];

    public function tabungan()
    {
        return $this->belongsTo(Tabungan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
