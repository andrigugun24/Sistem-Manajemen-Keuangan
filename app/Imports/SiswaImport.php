<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\Kelas;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class SiswaImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Skip baris kosong
        if (!isset($row['nisn']) || trim($row['nisn']) === '') {
            return null;
        }

        // Cari ID Kelas berdasarkan nama kelas
        $namaKelas = trim($row['kelas'] ?? '');
        $kelas = Kelas::where('nama_kelas', 'like', '%' . $namaKelas . '%')->first();

        // Jika kelas tidak ditemukan, set default 1 atau skip
        $kelasId = $kelas ? $kelas->id : null;
        if (!$kelasId) {
            // Jika Anda ingin melewatinya
            // return null;
            // Atau berikan nilai null sementara jika nullable
        }

        // Konversi tanggal excel
        $tanggalLahir = null;
        if (!empty($row['tanggal_lahir'])) {
            try {
                if (is_numeric($row['tanggal_lahir'])) {
                    $tanggalLahir = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tanggal_lahir'])->format('Y-m-d');
                } else {
                    $tanggalLahir = Carbon::parse($row['tanggal_lahir'])->format('Y-m-d');
                }
            } catch (\Exception $e) {
                // Biarkan null
            }
        }

        // Cek apakah NISN sudah ada untuk update atau pembuatan baru
        $siswa = Siswa::where('nisn', $row['nisn'])->first();

        if ($siswa) {
            // Update data yang ada
            $siswa->update([
                'nama_lengkap' => $row['nama_lengkap'] ?? $siswa->nama_lengkap,
                'tempat_lahir' => $row['tempat_lahir'] ?? $siswa->tempat_lahir,
                'tanggal_lahir' => $tanggalLahir ?? $siswa->tanggal_lahir,
                'jenis_kelamin' => strtoupper(trim($row['jenis_kelamin'] ?? $siswa->jenis_kelamin)),
                'agama' => $row['agama'] ?? $siswa->agama,
                'alamat' => $row['alamat'] ?? $siswa->alamat,
                'kelas_id' => $kelasId ?? $siswa->kelas_id,
                'instansi' => strtoupper(trim($row['instansi'] ?? $siswa->instansi)),
                'nama_ayah' => $row['nama_ayah'] ?? $siswa->nama_ayah,
                'nama_ibu' => $row['nama_ibu'] ?? $siswa->nama_ibu,
                'telepon_ortu' => $row['telepon_ortu'] ?? $siswa->telepon_ortu,
                'pekerjaan_ortu' => $row['pekerjaan_ortu'] ?? $siswa->pekerjaan_ortu,
                'status' => strtolower(trim($row['status'] ?? $siswa->status)),
            ]);
            return null; // Return null karena sudah diupdate secara manual
        }

        // Jika tidak ada, buat baru
        return new Siswa([
            'nisn' => (string) trim($row['nisn']),
            'nama_lengkap' => $row['nama_lengkap'] ?? '-',
            'tempat_lahir' => $row['tempat_lahir'] ?? null,
            'tanggal_lahir' => $tanggalLahir,
            'jenis_kelamin' => strtoupper(trim($row['jenis_kelamin'] ?? 'L')),
            'agama' => $row['agama'] ?? null,
            'alamat' => $row['alamat'] ?? null,
            'kelas_id' => $kelasId,
            'instansi' => strtoupper(trim($row['instansi'] ?? 'SMP')),
            'nama_ayah' => $row['nama_ayah'] ?? null,
            'nama_ibu' => $row['nama_ibu'] ?? null,
            'telepon_ortu' => $row['telepon_ortu'] ?? null,
            'pekerjaan_ortu' => $row['pekerjaan_ortu'] ?? null,
            'status' => strtolower(trim($row['status'] ?? 'aktif')),
        ]);
    }
}
