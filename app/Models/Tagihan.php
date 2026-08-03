<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tagihan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'siswa_id',
        'kategori_tagihan_id',
        'tahun_ajaran_id',
        'bulan_tagihan',
        'target_kelas',
        'nominal_tagihan',
        'sisa_tagihan',
        'status',
        'jatuh_tempo',
    ];

    protected $casts = [
        'jatuh_tempo' => 'date',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function kategoriTagihan()
    {
        return $this->belongsTo(KategoriTagihan::class);
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function detailPembayarans()
    {
        return $this->hasMany(DetailPembayaran::class);
    }
}
