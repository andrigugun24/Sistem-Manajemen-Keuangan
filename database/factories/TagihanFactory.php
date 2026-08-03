<?php

namespace Database\Factories;

use App\Models\Tagihan;
use App\Models\Siswa;
use App\Models\KategoriTagihan;
use App\Models\TahunAjaran;
use Illuminate\Database\Eloquent\Factories\Factory;

class TagihanFactory extends Factory
{
    protected $model = Tagihan::class;

    public function definition(): array
    {
        $nominal = $this->faker->randomElement([100000, 150000, 200000, 250000]);
        return [
            'siswa_id' => Siswa::factory(),
            'kategori_tagihan_id' => KategoriTagihan::factory(),
            'tahun_ajaran_id' => TahunAjaran::factory(),
            'bulan_tagihan' => 'Januari 2026',
            'target_kelas' => 'semua',
            'nominal_tagihan' => $nominal,
            'sisa_tagihan' => $nominal,
            'status' => 'belum_lunas',
            'jatuh_tempo' => now()->addDays(30),
        ];
    }
}
