<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tabungan extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id',
        'saldo',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function mutasiTabungans()
    {
        return $this->hasMany(MutasiTabungan::class);
    }
}
