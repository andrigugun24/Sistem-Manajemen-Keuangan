<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiRouteTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test API login endpoint.
     */
    public function test_api_login_returns_token(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_api_login_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test authenticated API endpoints.
     */
    public function test_api_get_user_info(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->getJson('/api/user', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['id', 'name', 'email', 'role']);
    }

    public function test_api_dashboard_stats(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->getJson('/api/dashboard/stats', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'saldo_kas', 'total_pemasukan', 'total_pengeluaran',
            'total_siswa_aktif', 'total_guru', 'total_kelas', 'total_tabungan',
        ]);
    }

    public function test_api_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);

        $response = $this->getJson('/api/dashboard/stats');
        $response->assertStatus(401);
    }

    public function test_api_logout(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->postJson('/api/logout', [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        // Token should be invalid after logout
        $this->getJson('/api/user', [
            'Authorization' => "Bearer {$token}",
        ])->assertStatus(401);
    }
}
