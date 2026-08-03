<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\TahunAjaran;
use App\Models\KategoriTagihan;
use App\Models\KategoriKeuangan;
use App\Models\Tagihan;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DataMasterSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Tahun Ajaran ───
        $ta = TahunAjaran::firstOrCreate(
            ['nama_tahun_ajaran' => '2025/2026', 'semester' => 'Genap'],
            ['aktif' => true]
        );

        // ─── Kelas ───
        $kelasList = [
            ['nama_kelas' => 'VII-A', 'instansi' => 'SMP'],
            ['nama_kelas' => 'VII-B', 'instansi' => 'SMP'],
            ['nama_kelas' => 'VIII-A', 'instansi' => 'SMP'],
            ['nama_kelas' => 'VIII-B', 'instansi' => 'SMP'],
            ['nama_kelas' => 'IX-A', 'instansi' => 'SMP'],
            ['nama_kelas' => 'X-IPA', 'instansi' => 'SMA'],
            ['nama_kelas' => 'X-IPS', 'instansi' => 'SMA'],
            ['nama_kelas' => 'XI-IPA', 'instansi' => 'SMA'],
            ['nama_kelas' => 'XII-IPA', 'instansi' => 'SMA'],
        ];

        foreach ($kelasList as $k) {
            Kelas::firstOrCreate($k);
        }

        $allKelas = Kelas::all();

        // ─── Guru ───
        $guruList = [
            ['nama_guru' => 'Ustadz Ahmad Fathoni', 'nip' => '198501012020011001', 'instansi' => 'SMP'],
            ['nama_guru' => 'Ustadzah Siti Maryam', 'nip' => '199002022020012002', 'instansi' => 'SMP'],
            ['nama_guru' => 'Ustadz Ilham Hakim', 'nip' => '198803032020011003', 'instansi' => 'SMA'],
            ['nama_guru' => 'Ustadzah Nur Aini', 'nip' => '199104042020012004', 'instansi' => 'SMA'],
            ['nama_guru' => 'KH. Abdul Rahman', 'nip' => null, 'instansi' => 'Keduanya/Yayasan'],
        ];

        foreach ($guruList as $g) {
            Guru::firstOrCreate(['nama_guru' => $g['nama_guru']], $g);
        }

        // ─── Kategori Tagihan ───
        $kategoriTagihanList = [
            ['nama_kategori' => 'Infaq Syahriah (SPP)', 'kode_tagihan' => 'SPP', 'jenis_tagihan' => 'Bulanan', 'nominal_default' => 350000, 'deskripsi' => 'Infaq bulanan wajib'],
            ['nama_kategori' => 'Uang Pangkal/Gedung', 'kode_tagihan' => 'UPG', 'jenis_tagihan' => 'Sekali Bayar', 'nominal_default' => 1500000, 'deskripsi' => 'Biaya pendaftaran/gedung'],
            ['nama_kategori' => 'Seragam Sekolah', 'kode_tagihan' => 'SRG', 'jenis_tagihan' => 'Sekali Bayar', 'nominal_default' => 800000, 'deskripsi' => 'Paket seragam lengkap'],
            ['nama_kategori' => 'Karya Wisata', 'kode_tagihan' => 'KW', 'jenis_tagihan' => 'Sekali Bayar', 'nominal_default' => 500000, 'deskripsi' => 'Biaya karya wisata tahunan'],
        ];

        foreach ($kategoriTagihanList as $kt) {
            KategoriTagihan::firstOrCreate(['kode_tagihan' => $kt['kode_tagihan']], $kt);
        }

        // ─── Kategori Keuangan ───
        $kategoriKeuanganList = [
            ['nama_kategori' => 'Pembayaran SPP', 'jenis' => 'Pemasukan'],
            ['nama_kategori' => 'Donasi & Infaq', 'jenis' => 'Pemasukan'],
            ['nama_kategori' => 'Gaji Guru', 'jenis' => 'Pengeluaran'],
            ['nama_kategori' => 'Operasional Sekolah', 'jenis' => 'Pengeluaran'],
            ['nama_kategori' => 'Pemeliharaan Gedung', 'jenis' => 'Pengeluaran'],
        ];

        foreach ($kategoriKeuanganList as $kk) {
            KategoriKeuangan::firstOrCreate(['nama_kategori' => $kk['nama_kategori']], $kk);
        }

        // ─── Siswa (10 sample) ───
        $siswaList = [
            ['nisn' => '2024001', 'nama_lengkap' => 'Ahmad Fauzi', 'jenis_kelamin' => 'L', 'instansi' => 'SMP', 'kelas' => 'VII-A', 'nama_ayah' => 'Budi Fauzi', 'nama_ibu' => 'Sari Mulyani'],
            ['nisn' => '2024002', 'nama_lengkap' => 'Siti Nurhaliza', 'jenis_kelamin' => 'P', 'instansi' => 'SMP', 'kelas' => 'VII-B', 'nama_ayah' => 'Hasan', 'nama_ibu' => 'Fatimah'],
            ['nisn' => '2024003', 'nama_lengkap' => 'Rizky Ramadhan', 'jenis_kelamin' => 'L', 'instansi' => 'SMP', 'kelas' => 'VIII-A', 'nama_ayah' => 'Dedi Ramadhan', 'nama_ibu' => 'Nurhayati'],
            ['nisn' => '2024004', 'nama_lengkap' => 'Dewi Lestari', 'jenis_kelamin' => 'P', 'instansi' => 'SMP', 'kelas' => 'VIII-B', 'nama_ayah' => 'Lestari', 'nama_ibu' => 'Dewi Sartika'],
            ['nisn' => '2024005', 'nama_lengkap' => 'Budi Sudarsono', 'jenis_kelamin' => 'L', 'instansi' => 'SMP', 'kelas' => 'IX-A', 'nama_ayah' => 'Sudarsono', 'nama_ibu' => 'Ani'],
            ['nisn' => '2024006', 'nama_lengkap' => 'Aisyah Putri', 'jenis_kelamin' => 'P', 'instansi' => 'SMA', 'kelas' => 'X-IPA', 'nama_ayah' => 'Ibrahim', 'nama_ibu' => 'Khadijah'],
            ['nisn' => '2024007', 'nama_lengkap' => 'Muhammad Ilham', 'jenis_kelamin' => 'L', 'instansi' => 'SMA', 'kelas' => 'X-IPS', 'nama_ayah' => 'Ilham Sr.', 'nama_ibu' => 'Ratna'],
            ['nisn' => '2024008', 'nama_lengkap' => 'Fatimah Zahra', 'jenis_kelamin' => 'P', 'instansi' => 'SMA', 'kelas' => 'XI-IPA', 'nama_ayah' => 'Zahra Sr.', 'nama_ibu' => 'Maimunah'],
            ['nisn' => '2024009', 'nama_lengkap' => 'Umar Hakim', 'jenis_kelamin' => 'L', 'instansi' => 'SMA', 'kelas' => 'XI-IPA', 'nama_ayah' => 'Hakim Sr.', 'nama_ibu' => 'Inayah'],
            ['nisn' => '2024010', 'nama_lengkap' => 'Zainab Azzahra', 'jenis_kelamin' => 'P', 'instansi' => 'SMA', 'kelas' => 'XII-IPA', 'nama_ayah' => 'Azzahra', 'nama_ibu' => 'Sumayyah'],
        ];

        foreach ($siswaList as $s) {
            $kelas = $allKelas->where('nama_kelas', $s['kelas'])->first();
            Siswa::firstOrCreate(
                ['nisn' => $s['nisn']],
                [
                    'nama_lengkap' => $s['nama_lengkap'],
                    'jenis_kelamin' => $s['jenis_kelamin'],
                    'instansi' => $s['instansi'],
                    'kelas_id' => $kelas->id,
                    'nama_ayah' => $s['nama_ayah'],
                    'nama_ibu' => $s['nama_ibu'],
                    'status' => 'aktif',
                ]
            );
        }

        // ─── Generate Tagihan SPP untuk semua siswa (12 bulan) ───
        $spp = KategoriTagihan::where('kode_tagihan', 'SPP')->first();
        $siswas = Siswa::where('status', 'aktif')->get();

        $bulanList = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                       'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
        $bulanKeNum = [
            'Juli' => 7, 'Agustus' => 8, 'September' => 9, 'Oktober' => 10,
            'November' => 11, 'Desember' => 12, 'Januari' => 1, 'Februari' => 2,
            'Maret' => 3, 'April' => 4, 'Mei' => 5, 'Juni' => 6,
        ];

        foreach ($siswas as $siswa) {
            foreach ($bulanList as $bulan) {
                $tahun = $bulanKeNum[$bulan] >= 7 ? '2025' : '2026';
                $bulanTagihan = "{$bulan} {$tahun}";

                $exists = Tagihan::where('siswa_id', $siswa->id)
                    ->where('kategori_tagihan_id', $spp->id)
                    ->where('bulan_tagihan', $bulanTagihan)
                    ->exists();

                if (!$exists) {
                    // Buat beberapa tagihan sudah lunas/sebagian untuk data yang realistis
                    $index = array_search($bulan, $bulanList);
                    $isLunas = $index < 6; // Juli-Desember sudah lunas
                    $isSebagian = $index === 6 && $siswa->id % 3 === 0; // Sebagian Januari

                    $sisa = $isLunas ? 0 : ($isSebagian ? 200000 : 350000);
                    $status = $isLunas ? 'lunas' : ($isSebagian ? 'sebagian' : 'belum_lunas');

                    Tagihan::create([
                        'siswa_id' => $siswa->id,
                        'kategori_tagihan_id' => $spp->id,
                        'tahun_ajaran_id' => $ta->id,
                        'bulan_tagihan' => $bulanTagihan,
                        'nominal_tagihan' => 350000,
                        'sisa_tagihan' => $sisa,
                        'status' => $status,
                        'jatuh_tempo' => Carbon::create($tahun, $bulanKeNum[$bulan], 10)->format('Y-m-d'),
                    ]);
                }
            }
        }
    }
}
