<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Guru;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GuruTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_guru_index(): void
    {
        $user = $this->adminUser();
        Guru::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('guru.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_guru(): void
    {
        $user = $this->adminUser();

        $response = $this->actingAs($user)->post(route('guru.store'), [
            'nama_guru' => 'Guru Test',
            'nip' => '123456789',
            'instansi' => 'SMP',
        ]);

        $response->assertRedirect(route('guru.index'));
        $this->assertDatabaseHas('gurus', ['nama_guru' => 'Guru Test']);
    }

    public function test_admin_can_create_guru_with_foto(): void
    {
        Storage::fake('public');
        $user = $this->adminUser();

        $response = $this->actingAs($user)->post(route('guru.store'), [
            'nama_guru' => 'Guru Foto',
            'nip' => '987654321',
            'instansi' => 'SMA',
            'foto' => UploadedFile::fake()->image('guru.jpg', 200, 200),
        ]);

        $response->assertRedirect(route('guru.index'));
        $guru = Guru::where('nama_guru', 'Guru Foto')->first();
        $this->assertNotNull($guru->foto);
        Storage::disk('public')->assertExists($guru->foto);
    }

    public function test_admin_can_update_guru(): void
    {
        $user = $this->adminUser();
        $guru = Guru::factory()->create();

        $response = $this->actingAs($user)->put(route('guru.update', $guru), [
            'nama_guru' => 'Nama Update',
            'nip' => $guru->nip,
            'instansi' => 'SMA',
        ]);

        $response->assertRedirect(route('guru.index'));
        $this->assertDatabaseHas('gurus', ['id' => $guru->id, 'nama_guru' => 'Nama Update']);
    }

    public function test_admin_can_delete_guru(): void
    {
        $user = $this->adminUser();
        $guru = Guru::factory()->create();

        $response = $this->actingAs($user)->delete(route('guru.destroy', $guru));
        $response->assertRedirect(route('guru.index'));
        $this->assertSoftDeleted('gurus', ['id' => $guru->id]);
    }
}
