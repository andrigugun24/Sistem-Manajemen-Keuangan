<?php

namespace Database\Factories;

use App\Models\TahunAjaran;
use Illuminate\Database\Eloquent\Factories\Factory;

class TahunAjaranFactory extends Factory
{
    protected $model = TahunAjaran::class;

    public function definition(): array
    {
        $tahun = $this->faker->numberBetween(2024, 2026);
        return [
            'nama_tahun_ajaran' => "{$tahun}/" . ($tahun + 1),
            'aktif' => true,
        ];
    }
}
