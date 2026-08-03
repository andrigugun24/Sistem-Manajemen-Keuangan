<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriKeuangan extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_kategori',
        'jenis',
    ];

    public function transaksiKas()
    {
        return $this->hasMany(TransaksiKas::class);
    }
}
