<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'nisn', 'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
        'agama', 'alamat', 'kelas_id', 'instansi', 'foto',
        'nama_ayah', 'nama_ibu', 'telepon_ortu', 'pekerjaan_ortu',
        'status'
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function tagihans()
    {
        return $this->hasMany(Tagihan::class);
    }

    public function pembayarans()
    {
        return $this->hasMany(Pembayaran::class);
    }

    public function tabungan()
    {
        return $this->hasOne(Tabungan::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
