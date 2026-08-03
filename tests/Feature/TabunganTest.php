<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TabunganTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_tabungan_index(): void
    {
        $user = $this->adminUser();
        $response = $this->actingAs($user)->get(route('tabungan.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_setor_tabungan(): void
    {
        $user = $this->adminUser();
        $siswa = Siswa::factory()->create();

        $response = $this->actingAs($user)->post(route('tabungan.setor.store'), [
            'siswa_id' => $siswa->id,
            'nominal' => 50000,
            'tanggal_mutasi' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('tabungan.setor'));

        // Tabungan auto-created and saldo correct
        $this->assertDatabaseHas('tabungans', [
            'siswa_id' => $siswa->id,
            'saldo' => 50000,
        ]);

        // Mutasi recorded
        $this->assertDatabaseHas('mutasi_tabungans', [
            'jenis_mutasi' => 'setor',
            'nominal' => 50000,
        ]);
    }

    public function test_admin_can_tarik_tabungan(): void
    {
        $user = $this->adminUser();
        $siswa = Siswa::factory()->create();
        $tabungan = Tabungan::create([
            'siswa_id' => $siswa->id,
            'saldo' => 100000,
        ]);

        $response = $this->actingAs($user)->post(route('tabungan.tarik.store'), [
            'siswa_id' => $siswa->id,
            'nominal' => 30000,
            'tanggal_mutasi' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('tabungan.tarik'));

        $tabungan->refresh();
        $this->assertEquals(70000, $tabungan->saldo);
    }

    public function test_cannot_tarik_more_than_saldo(): void
    {
        $user = $this->adminUser();
        $siswa = Siswa::factory()->create();
        Tabungan::create([
            'siswa_id' => $siswa->id,
            'saldo' => 10000,
        ]);

        $response = $this->actingAs($user)->post(route('tabungan.tarik.store'), [
            'siswa_id' => $siswa->id,
            'nominal' => 50000,
            'tanggal_mutasi' => now()->toDateString(),
        ]);

        $response->assertSessionHas('error');
    }
}
