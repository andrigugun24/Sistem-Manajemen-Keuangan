<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'data_lama' => 'json',
        'data_baru' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
