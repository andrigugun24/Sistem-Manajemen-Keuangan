<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiswaTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_siswa_index(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();
        Siswa::factory()->count(3)->create(['kelas_id' => $kelas->id]);

        $response = $this->actingAs($user)->get(route('siswa.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_siswa(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();

        $response = $this->actingAs($user)->post(route('siswa.store'), [
            'nis' => '123456',
            'nama_lengkap' => 'Test Siswa',
            'jenis_kelamin' => 'L',
            'kelas_id' => $kelas->id,
            'instansi' => 'SMP',
        ]);

        $response->assertRedirect(route('siswa.index'));
        $this->assertDatabaseHas('siswas', ['nis' => '123456', 'nama_lengkap' => 'Test Siswa']);
    }

    public function test_admin_can_create_siswa_with_foto(): void
    {
        Storage::fake('public');
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();

        $response = $this->actingAs($user)->post(route('siswa.store'), [
            'nis' => '789012',
            'nama_lengkap' => 'Siswa Foto',
            'jenis_kelamin' => 'P',
            'kelas_id' => $kelas->id,
            'instansi' => 'SMA',
            'foto' => UploadedFile::fake()->image('foto.jpg', 200, 200),
        ]);

        $response->assertRedirect(route('siswa.index'));
        $siswa = Siswa::where('nis', '789012')->first();
        $this->assertNotNull($siswa->foto);
        Storage::disk('public')->assertExists($siswa->foto);
    }

    public function test_admin_can_update_siswa(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();
        $siswa = Siswa::factory()->create(['kelas_id' => $kelas->id]);

        $response = $this->actingAs($user)->put(route('siswa.update', $siswa), [
            'nis' => $siswa->nis,
            'nama_lengkap' => 'Nama Baru',
            'jenis_kelamin' => $siswa->jenis_kelamin,
            'kelas_id' => $kelas->id,
            'instansi' => $siswa->instansi,
        ]);

        $response->assertRedirect(route('siswa.index'));
        $this->assertDatabaseHas('siswas', ['id' => $siswa->id, 'nama_lengkap' => 'Nama Baru']);
    }

    public function test_admin_can_delete_siswa(): void
    {
        $user = $this->adminUser();
        $siswa = Siswa::factory()->create();

        $response = $this->actingAs($user)->delete(route('siswa.destroy', $siswa));
        $response->assertRedirect(route('siswa.index'));
        $this->assertSoftDeleted('siswas', ['id' => $siswa->id]);
    }

    public function test_nis_must_be_unique(): void
    {
        $user = $this->adminUser();
        $kelas = Kelas::factory()->create();
        Siswa::factory()->create(['nis' => 'DUPLICATE', 'kelas_id' => $kelas->id]);

        $response = $this->actingAs($user)->post(route('siswa.store'), [
            'nis' => 'DUPLICATE',
            'nama_lengkap' => 'Another Student',
            'jenis_kelamin' => 'L',
            'kelas_id' => $kelas->id,
            'instansi' => 'SMP',
        ]);

        $response->assertSessionHasErrors('nis');
    }
}
