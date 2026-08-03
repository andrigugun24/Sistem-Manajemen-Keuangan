<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriTagihan extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_kategori',
        'kode_tagihan',
        'jenis_tagihan',
        'nominal_default',
        'deskripsi',
    ];

    public function tagihans()
    {
        return $this->hasMany(Tagihan::class);
    }
}
