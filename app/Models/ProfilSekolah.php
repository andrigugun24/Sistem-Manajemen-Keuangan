<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilSekolah extends Model
{
    protected $table = 'profil_sekolahs';

    protected $fillable = [
        'nama_sekolah',
        'alamat',
        'telepon',
        'email',
        'website',
        'kepala_sekolah',
        'nip_kepala_sekolah',
        'logo',
    ];
}
