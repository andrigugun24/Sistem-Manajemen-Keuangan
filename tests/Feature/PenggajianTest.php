<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Guru;
use App\Models\KategoriKeuangan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PenggajianTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_gaji_index(): void
    {
        $user = $this->adminUser();
        Guru::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('kas.gaji.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_process_gaji(): void
    {
        $user = $this->adminUser();
        $guru = Guru::factory()->create();

        $response = $this->actingAs($user)->post(route('kas.gaji.store'), [
            'guru_id' => $guru->id,
            'bulan' => 3,
            'tahun' => 2026,
            'gaji_pokok' => 3000000,
            'tunjangan' => 500000,
            'potongan' => 100000,
            'jenis_kas' => 'umum',
        ]);

        $response->assertRedirect(route('kas.gaji.index'));

        // Penggajian record exists
        $this->assertDatabaseHas('penggajians', [
            'guru_id' => $guru->id,
            'gaji_pokok' => 3000000,
            'tunjangan' => 500000,
            'potongan' => 100000,
            'total_gaji' => 3400000,
            'status' => 'dibayar',
        ]);

        // Kas keluar recorded
        $this->assertDatabaseHas('transaksi_kas', [
            'tipe_transaksi' => 'keluar',
            'nominal' => 3400000,
        ]);
    }

    public function test_cannot_process_gaji_twice_same_period(): void
    {
        $user = $this->adminUser();
        $guru = Guru::factory()->create();

        // First payment
        $this->actingAs($user)->post(route('kas.gaji.store'), [
            'guru_id' => $guru->id,
            'bulan' => 3,
            'tahun' => 2026,
            'gaji_pokok' => 3000000,
            'tunjangan' => 0,
            'potongan' => 0,
        ]);

        // Second payment same period should fail
        $response = $this->actingAs($user)->post(route('kas.gaji.store'), [
            'guru_id' => $guru->id,
            'bulan' => 3,
            'tahun' => 2026,
            'gaji_pokok' => 3000000,
            'tunjangan' => 0,
            'potongan' => 0,
        ]);

        $response->assertSessionHas('error');
    }
}
