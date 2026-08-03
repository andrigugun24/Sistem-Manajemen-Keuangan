<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Tagihan;
use App\Models\KategoriTagihan;
use App\Models\TahunAjaran;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PembayaranTest extends TestCase
{
    use RefreshDatabase;

    private function setupPaymentData(): array
    {
        $user = User::factory()->create(['role' => 'admin']);
        $kelas = Kelas::factory()->create();
        $siswa = Siswa::factory()->create(['kelas_id' => $kelas->id]);
        $kategori = KategoriTagihan::factory()->create();
        $tahunAjaran = TahunAjaran::factory()->create();

        $tagihan = Tagihan::factory()->create([
            'siswa_id' => $siswa->id,
            'kategori_tagihan_id' => $kategori->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'nominal_tagihan' => 150000,
            'sisa_tagihan' => 150000,
        ]);

        return compact('user', 'siswa', 'tagihan');
    }

    public function test_admin_can_view_pembayaran_index(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get(route('pembayaran.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_process_tunai_payment(): void
    {
        $data = $this->setupPaymentData();

        $response = $this->actingAs($data['user'])->post(route('pembayaran.store'), [
            'siswa_id' => $data['siswa']->id,
            'metode_pembayaran' => 'tunai',
            'items' => [
                [
                    'tagihan_id' => $data['tagihan']->id,
                    'nominal_bayar' => 150000,
                ],
            ],
        ]);

        $response->assertRedirect(route('pembayaran.index'));

        // Tagihan should be lunas
        $data['tagihan']->refresh();
        $this->assertEquals('lunas', $data['tagihan']->status);
        $this->assertEquals(0, $data['tagihan']->sisa_tagihan);

        // Pembayaran record exists
        $this->assertDatabaseHas('pembayarans', [
            'siswa_id' => $data['siswa']->id,
            'status_pembayaran' => 'lunas',
            'total_bayar' => 150000,
        ]);

        // Kas masuk autocreated
        $this->assertDatabaseHas('transaksi_kas', [
            'tipe_transaksi' => 'masuk',
            'nominal' => 150000,
        ]);
    }

    public function test_transfer_payment_requires_verification(): void
    {
        $data = $this->setupPaymentData();

        $response = $this->actingAs($data['user'])->post(route('pembayaran.store'), [
            'siswa_id' => $data['siswa']->id,
            'metode_pembayaran' => 'transfer',
            'items' => [
                [
                    'tagihan_id' => $data['tagihan']->id,
                    'nominal_bayar' => 150000,
                ],
            ],
        ]);

        $response->assertRedirect(route('pembayaran.index'));

        // Status should be menunggu (not lunas)
        $this->assertDatabaseHas('pembayarans', [
            'siswa_id' => $data['siswa']->id,
            'status_pembayaran' => 'menunggu',
        ]);

        // Tagihan should NOT be updated yet
        $data['tagihan']->refresh();
        $this->assertEquals('belum_lunas', $data['tagihan']->status);
        $this->assertEquals(150000, $data['tagihan']->sisa_tagihan);
    }

    public function test_partial_payment_updates_sisa(): void
    {
        $data = $this->setupPaymentData();

        $response = $this->actingAs($data['user'])->post(route('pembayaran.store'), [
            'siswa_id' => $data['siswa']->id,
            'metode_pembayaran' => 'tunai',
            'items' => [
                [
                    'tagihan_id' => $data['tagihan']->id,
                    'nominal_bayar' => 50000, // partial payment
                ],
            ],
        ]);

        $response->assertRedirect(route('pembayaran.index'));

        $data['tagihan']->refresh();
        $this->assertEquals('sebagian', $data['tagihan']->status);
        $this->assertEquals(100000, $data['tagihan']->sisa_tagihan);
    }
}
