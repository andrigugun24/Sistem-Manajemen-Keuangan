<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Kelas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KelasTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_kelas_index(): void
    {
        $user = $this->adminUser();
        Kelas::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('kelas.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_kelas(): void
    {
        $user = $this->adminUser();

        $response = $this->actingAs($user)->post(route('kelas.store'), [
            'nama_kelas' => 'Kelas Baru',
            'instansi' => 'SMP',
        ]);

        $response->assertRedirect(route('kelas.index'));
        $this->assertDatabaseHas('kelas', ['nama_kelas' => 'Kelas Baru']);
    }

    public function test_admin_can_update_kelas(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();

        $response = $this->actingAs($user)->put(route('kelas.update', $kelas), [
            'nama_kelas' => 'Updated Kelas',
            'instansi' => 'SMA',
        ]);

        $response->assertRedirect(route('kelas.index'));
        $this->assertDatabaseHas('kelas', ['id' => $kelas->id, 'nama_kelas' => 'Updated Kelas']);
    }

    public function test_admin_can_delete_kelas(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();

        $response = $this->actingAs($user)->delete(route('kelas.destroy', $kelas));
        $response->assertRedirect(route('kelas.index'));
    }
}
