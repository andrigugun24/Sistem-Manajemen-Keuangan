<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Tagihan;
use App\Models\KategoriTagihan;
use App\Models\TahunAjaran;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_admin_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get(route('dashboard.admin'));
        $response->assertStatus(200);
    }

    public function test_bendahara_can_view_bendahara_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'bendahara']);

        $response = $this->actingAs($user)->get(route('dashboard.bendahara'));
        $response->assertStatus(200);
    }

    public function test_kepala_sekolah_can_view_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'kepala_sekolah']);

        $response = $this->actingAs($user)->get(route('dashboard.kepala-sekolah'));
        $response->assertStatus(200);
    }

    public function test_kepala_yayasan_can_view_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'kepala_yayasan']);

        $response = $this->actingAs($user)->get(route('dashboard.kepala-yayasan'));
        $response->assertStatus(200);
    }

    public function test_orang_tua_can_view_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'orang_tua']);

        $response = $this->actingAs($user)->get(route('dashboard.orang-tua'));
        $response->assertStatus(200);
    }

    public function test_admin_dashboard_shows_correct_stats(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $kelas = Kelas::factory()->create();
        Siswa::factory()->count(5)->create(['kelas_id' => $kelas->id, 'status' => 'aktif']);
        Guru::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('dashboard.admin'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Dashboard/AdminDashboard')
                ->has('stats', fn ($stats) =>
                    $stats->where('totalSiswa', 5)
                        ->where('totalGuru', 3)
                        ->etc()
                )
        );
    }
}
