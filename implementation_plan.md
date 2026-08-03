# Perbaikan Bug, Filter, dan Reporting Sistem

Berikut adalah rencana implementasi untuk memperbaiki semua kendala yang telah dilaporkan. Rencana ini dibagi ke dalam area fungsional dari aplikasi untuk mempermudah pengerjaan dan pengujian.

## Open Questions
- Untuk fitur hapus data (Data Dummy): Apakah Anda setuju jika seluruh data Master (Kelas, Siswa) dan Data Transaksi (Tagihan, Pembayaran, Kas, Tabungan, Penggajian) dihapus seluruhnya dari database, **KECUALI** data Pengguna (Admin, Kepala Sekolah, dll) dan Data Kategori dasar?
- Untuk periode penggajian: Periode ini secara default dibuat dinamis berdasarkan bulan saat ini. Saya akan mengaktifkan fiturnya agar saat diganti, data penggajian yang tampil benar-benar sesuai dengan bulan dan tahun yang dipilih. Apakah itu sesuai ekspektasi?
- Untuk tabel Pegawai (sebelumnya Guru): Apakah kita cukup menambahkan kolom `tipe_pegawai` (pilihan: Guru / Staff) di database yang sama agar sistem bisa menampung Staff juga tanpa merombak seluruh struktur tabel?

## Proposed Changes

### Data Kelas & Siswa
Memperbaiki total siswa yang saat ini statis ("Belum Ada").
#### [MODIFY] app/Http/Controllers/KelasController.php
- Mengubah query `$kelas = Kelas::latest()->get();` menjadi `Kelas::withCount('siswas')->latest()->get();` agar data total siswa terhubung dengan database.
#### [MODIFY] resources/js/Pages/DataMaster/DataKelas/Index.jsx
- Mengganti teks statis "Belum Ada" dengan data `{kelas.siswas_count} Siswa`.

---

### Keuangan: Tagihan & Pembayaran (Riwayat Transaksi)
Memperbaiki fungsi pencarian dan filter di halaman Tagihan serta Pembayaran.
#### [MODIFY] app/Http/Controllers/TagihanController.php
- Menambahkan backend logic (where clause) untuk menangani request filter (Tahun Ajaran, Kelas Target, Jenis Tagihan, Status Progres) dan `search` (Pencarian Kode) dari frontend.
#### [MODIFY] resources/js/Pages/Keuangan/Tagihan/Index.jsx
- Menghubungkan element `<select>` filter dan `<input>` pencarian dengan parameter URL dan trigger Inertia router (router.get) agar filter benar-benar berfungsi dengan akurat.
#### [MODIFY] resources/js/Pages/Keuangan/Pembayaran/Index.jsx
- Menambahkan form pencarian detail (seperti Nomor Referensi, Nama Siswa, dll) yang sinkron dengan backend.
- Memperbaiki filter tab status (Semua, Menunggu, Lunas, Ditolak) agar memanggil request yang lebih detail.

---

### Tabungan Siswa
Menghapus tombol shortcut dan memperbaiki fungsi Mutasi / Buku Tabungan.
#### [MODIFY] resources/js/Pages/Tabungan/Index.jsx
- Menghapus komponen tombol shortcut "Setor" dan "Tarik" di bagian atas halaman (Header) agar akses hanya bisa dilakukan dari sidebar.
#### [MODIFY] resources/js/Pages/Tabungan/BukuTabungan.jsx
- Menghubungkan dropdown "Pilih Siswa" dengan list asli siswa yang memiliki tabungan.
- Menghubungkan aksi tombol "Cetak PDF" agar memanggil rute export PDF.
#### [MODIFY] app/Http/Controllers/TabunganController.php
- Menambahkan fungsi / endpoint `exportPdfBukuTabungan` untuk mencetak riwayat mutasi dalam bentuk PDF.

---

### Kas: Penggajian & Buku Kas & Eksekutif
Memperjelas periode penggajian, menangani tunjangan & potongan dinamis, mencetak slip gaji, dan mengakomodasi data Staff.
#### [NEW] database/migrations/..._add_details_to_penggajian_and_type_to_gurus.php
- Menambahkan kolom `tipe_pegawai` pada tabel `gurus` untuk membedakan antara Guru dan Staff.
- Menambahkan kolom `detail_tunjangan` (JSON) dan `detail_potongan` (JSON) pada tabel `penggajians` untuk menyimpan rincian item (misal: "Tunjangan Wali Kelas: 500rb", "Potongan Telat: 50rb").
#### [MODIFY] resources/js/Pages/Kas/GajiGuru/Index.jsx
- Mengubah element dropdown `<select>` "Periode Aktif" agar berfungsi mengirim bulan & tahun ke backend (Inertia get).
- Menambahkan penjelasan singkat (tooltip / teks tambahan) untuk fungsi Periode Aktif.
#### [MODIFY] resources/js/Pages/Kas/GajiGuru/Slip.jsx
- Mengubah form agar dapat menambah baris baru (dinamis) untuk berbagai jenis Tunjangan dan Potongan.
- Menambahkan tombol "Cetak Slip Gaji (PDF)".
#### [MODIFY] app/Http/Controllers/PenggajianController.php
- Memperbarui fungsi `store()` untuk menyimpan rincian tunjangan dan potongan ke format JSON.
- Menambahkan fungsi `cetakSlip()` untuk mengekspor Slip Gaji ke format PDF.
#### [MODIFY] app/Http/Controllers/LaporanController.php
- Memperbaiki backend logika untuk `exportPdf()` Kas (Kas Umum & BOS) agar filter rentang tanggal (periode) berfungsi dan PDF ter-generate.
- Menambahkan fitur export PDF untuk laporan Eksekutif Rekap Kategori.
#### [MODIFY] resources/js/Pages/Laporan/Keuangan.jsx & Eksekutif.jsx
- Menghubungkan tombol "Cetak PDF" agar men-trigger endpoint dengan parameter rentang tanggal dari controller Laporan.

---

### Pembersihan Data (Database)
Menghapus seluruh data uji coba (Dummy).
#### [NEW] database/seeders/CleanDummyDataSeeder.php
- Membuat *seeder* skrip / *artisan command* untuk menghapus secara permanen semua transaksi dan data siswa, dengan mempertahankan tabel master statis dan Akun Pengguna Utama.

## Verification Plan

### Manual Verification
1. **Kelas**: Membuka Data Kelas dan memastikan total siswa muncul dalam bentuk angka.
2. **Tagihan & Transaksi**: Melakukan pencarian kode dan perubahan status di halaman Tagihan dan Transaksi untuk memastikan data ter-filter sesuai masukan.
3. **Tabungan**: Mengecek Dashboard tabungan apakah shortcut hilang. Menuju Riwayat Mutasi, memilih siswa secara spesifik, dan mencoba Cetak PDF.
4. **Laporan & Penggajian**: Mengganti periode penggajian dan memastikan datanya berubah. Mencetak PDF Buku Kas dan Rekap Kategori.
5. **Database**: Mengecek apakah setelah pembersihan data, database kembali kosong (bersih) di bagian transaksi dan master siswa, namun user (admin, guru, yayasan) tetap bisa login.
