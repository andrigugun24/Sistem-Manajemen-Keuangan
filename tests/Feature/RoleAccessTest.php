<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Guru;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Admin routes should block non-admin users.
     */
    public function test_non_admin_cannot_access_data_master(): void
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);
        $orangTua = User::factory()->create(['role' => 'orang_tua']);
        $kepalaSekolah = User::factory()->create(['role' => 'kepala_sekolah']);

        // Bendahara should NOT access data master
        $this->actingAs($bendahara)->get(route('siswa.index'))->assertStatus(403);
        $this->actingAs($orangTua)->get(route('siswa.index'))->assertStatus(403);
        $this->actingAs($kepalaSekolah)->get(route('siswa.index'))->assertStatus(403);
    }

    public function test_admin_can_access_data_master(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get(route('siswa.index'))->assertStatus(200);
        $this->actingAs($admin)->get(route('guru.index'))->assertStatus(200);
        $this->actingAs($admin)->get(route('kelas.index'))->assertStatus(200);
    }

    public function test_non_admin_cannot_access_pengguna_management(): void
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);

        $this->actingAs($bendahara)->get(route('pengguna.index'))->assertStatus(403);
    }

    public function test_admin_can_access_pengguna_management(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get(route('pengguna.index'))->assertStatus(200);
    }

    /**
     * Test: Keuangan routes should only allow admin and bendahara.
     */
    public function test_bendahara_can_access_keuangan(): void
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);

        $this->actingAs($bendahara)->get(route('pembayaran.index'))->assertStatus(200);
        $this->actingAs($bendahara)->get(route('tagihan.index'))->assertStatus(200);
    }

    public function test_orang_tua_cannot_access_keuangan(): void
    {
        $orangTua = User::factory()->create(['role' => 'orang_tua']);

        $this->actingAs($orangTua)->get(route('pembayaran.index'))->assertStatus(403);
        $this->actingAs($orangTua)->get(route('tagihan.index'))->assertStatus(403);
    }

    /**
     * Test: Portal Orang Tua should only allow orang_tua.
     */
    public function test_orang_tua_can_access_portal(): void
    {
        $orangTua = User::factory()->create(['role' => 'orang_tua']);

        $this->actingAs($orangTua)->get(route('portal.tagihan'))->assertStatus(200);
        $this->actingAs($orangTua)->get(route('portal.tabungan'))->assertStatus(200);
    }

    public function test_admin_cannot_access_portal_orang_tua(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get(route('portal.tagihan'))->assertStatus(403);
    }

    /**
     * Test: Guest (not logged in) cannot access protected routes.
     */
    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('siswa.index'))->assertRedirect(route('login'));
        $this->get(route('pembayaran.index'))->assertRedirect(route('login'));
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }
}
