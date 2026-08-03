<?php

namespace Database\Factories;

use App\Models\Guru;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuruFactory extends Factory
{
    protected $model = Guru::class;

    public function definition(): array
    {
        return [
            'nama_guru' => $this->faker->name(),
            'nip' => $this->faker->unique()->numerify('##################'),
            'instansi' => $this->faker->randomElement(['SMP', 'SMA', 'Keduanya/Yayasan']),
        ];
    }
}
