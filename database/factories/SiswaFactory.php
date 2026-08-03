<?php

namespace Database\Factories;

use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    public function definition(): array
    {
        return [
            'nisn' => $this->faker->unique()->numerify('######'),
            'nama_lengkap' => $this->faker->name(),
            'tempat_lahir' => $this->faker->city(),
            'tanggal_lahir' => $this->faker->date(),
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
            'agama' => 'Islam',
            'alamat' => $this->faker->address(),
            'kelas_id' => Kelas::factory(),
            'instansi' => $this->faker->randomElement(['SMP', 'SMA']),
            'nama_ayah' => $this->faker->name('male'),
            'nama_ibu' => $this->faker->name('female'),
            'telepon_ortu' => $this->faker->phoneNumber(),
            'pekerjaan_ortu' => $this->faker->jobTitle(),
            'status' => 'aktif',
        ];
    }
}
