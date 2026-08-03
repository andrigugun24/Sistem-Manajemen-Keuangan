<?php

namespace Database\Factories;

use App\Models\KategoriTagihan;
use Illuminate\Database\Eloquent\Factories\Factory;

class KategoriTagihanFactory extends Factory
{
    protected $model = KategoriTagihan::class;

    public function definition(): array
    {
        return [
            'nama_kategori' => 'SPP Bulanan',
            'nominal_default' => 150000,
            'deskripsi' => 'Sumbangan Pembinaan Pendidikan bulanan',
        ];
    }
}
