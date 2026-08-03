<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guru extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'nama_guru',
        'nip',
        'instansi',
        'tipe_pegawai',
        'foto',
    ];

    public function penggajians()
    {
        return $this->hasMany(Penggajian::class);
    }
}
