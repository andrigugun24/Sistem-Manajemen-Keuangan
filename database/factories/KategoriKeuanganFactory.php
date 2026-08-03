<?php

namespace Database\Factories;

use App\Models\KategoriKeuangan;
use Illuminate\Database\Eloquent\Factories\Factory;

class KategoriKeuanganFactory extends Factory
{
    protected $model = KategoriKeuangan::class;

    public function definition(): array
    {
        return [
            'nama_kategori' => $this->faker->words(2, true),
            'jenis' => $this->faker->randomElement(['Pemasukan', 'Pengeluaran']),
        ];
    }
}
