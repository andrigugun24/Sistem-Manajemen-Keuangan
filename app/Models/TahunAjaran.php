<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_tahun_ajaran',
        'semester',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function tagihans()
    {
        return $this->hasMany(Tagihan::class);
    }
}
