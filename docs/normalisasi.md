# DOKUMEN NORMALISASI BASIS DATA
## Sistem Informasi Keuangan Ponpes La Tahzan Citeras (Sekolah Ananda)

Dokumen ini disusun untuk melengkapi berkas skripsi (Bab 3 - Perancangan Basis Data). Normalisasi ini dirancang agar selaras dengan **Entity Relationship Diagram (ERD)** dan **Logical Record Structure (LRS)** yang sudah dibuat, dengan fokus khusus pada dua proses bisnis utama yang paling krusial:

1. **Proses Bisnis Pembayaran Tagihan Keuangan (SPP & Uang Gedung)**
2. **Proses Bisnis Tabungan Siswa (Setoran & Penarikan)**

---

### PROSES BISNIS 1: TRANSAKSI PEMBAYARAN TAGIHAN SISWA
Proses bisnis ini mencatat alokasi pembayaran dari siswa untuk melunasi satu atau beberapa tagihan sekaligus melalui bendahara sekolah.

#### 1. Unnormalized Form (UNF)
Pada tahap ini, data dikumpulkan dari dokumen bukti fisik berupa **Kuitansi Pembayaran SPP/Tagihan** manual yang masih mengandung kelompok berulang (*repeating groups*) pada rincian tagihan yang dibayar.

*   **Atribut Mentah:** No_Referensi, Tanggal_Bayar, NISN, Nama_Lengkap, Nama_Kelas, Jenjang_Instansi, Metode_Pembayaran, Nama_Bendahara, Role_User, Total_Bayar, Status_Pembayaran, [Tagihan_ID, Kategori_Tagihan, Nominal_Tagihan, Nominal_Bayar] (kelompok berulang).

##### Representasi Kuitansi / Bukti Pembayaran Manual (UNF)
```
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| KUITANSI PEMBAYARAN                                                                                                                                                                                                                                                                                                                                                                                                           |
| No. Referensi : PEMB-20260520-001              Tanggal : 2026-05-20                                                                                                                                                                                                                                                                                                                                                           |
| NISN          : 1234567890                     Petugas : Budi Santoso (Bendahara)                                                                                                                                                                                                                                                                                                                                             |
| Nama Siswa    : Muhammad Rizky                 Metode  : Transfer                                                                                                                                                                                                                                                                                                                                                             |
| Kelas         : IX-A (SMP)                     Status  : Lunas                                                                                                                                                                                                                                                                                                                                                                |
+---------------+--------------------------------+--------------------+---------------------+                                                                                                                                                                                                                                                                                                                                   |
| Tagihan ID    | Jenis / Kategori Tagihan       | Nominal Tagihan    | Nominal Dibayar     |                                                                                                                                                                                                                                                                                                                                   |
+---------------+--------------------------------+--------------------+---------------------+                                                                                                                                                                                                                                                                                                                                   |
| TAG-001       | SPP Bulan Juli 2026            | Rp 250.000         | Rp 250.000          |                                                                                                                                                                                                                                                                                                                                   |
| TAG-002       | Uang Pembangunan              | Rp 500.000         | Rp 500.000          |                                                                                                                                                                                                                                                                                                                                   |
+---------------+--------------------------------+--------------------+---------------------+                                                                                                                                                                                                                                                                                                                                   |
| Total Bayar   : Rp 750.000                                                                                                                                                                                                                                                                                                                                                                                                    |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

---

#### 2. Bentuk Normal Kesatu (1NF)
Bentuk normal kesatu (1NF) tercapai ketika semua atribut dalam tabel bernilai tunggal (*atomic value*) dan **kelompok berulang (repeating groups) dihilangkan** dengan cara menduplikasi data *header* ke setiap baris rincian pembayaran.

| No_Referensi | Tanggal_Bayar | NISN | Nama_Lengkap | Nama_Kelas | Instansi | Metode | Nama_Bendahara | Role | Total_Bayar | Status_Bayar | Tagihan_ID | Kategori_Tagihan | Nominal_Tagihan | Nominal_Bayar |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PEMB-001** | 2026-05-20 | 123456 | M. Rizky | IX-A | SMP | transfer | Budi Santoso | Bendahara | 750000 | lunas | **TAG-001** | SPP Juli 2026 | 250000 | 250000 |
| **PEMB-001** | 2026-05-20 | 123456 | M. Rizky | IX-A | SMP | transfer | Budi Santoso | Bendahara | 750000 | lunas | **TAG-002** | Uang Pembangunan | 500000 | 500000 |

> [!NOTE]
> **Kunci Utama Campuran (Composite Primary Key):** Pada 1NF ini, kunci utama yang unik untuk mengidentifikasi setiap baris data secara tunggal adalah gabungan dari **(No_Referensi, Tagihan_ID)**.

---

#### 3. Bentuk Normal Kedua (2NF)
Bentuk normal kedua (2NF) terpenuhi jika data telah berada dalam format 1NF dan **menghilangkan ketergantungan parsial (partial dependency)**. Artinya, semua atribut non-key harus bergantung sepenuhnya (*fully functionally dependent*) pada kunci utama utuh, bukan hanya sebagian kunci utama campuran.

Dari tabel 1NF di atas, terdapat beberapa ketergantungan parsial:
*   Atribut *header* pembayaran (`Tanggal_Bayar`, `NISN`, `Nama_Lengkap`, `Nama_Kelas`, `Instansi`, `Metode`, `Nama_Bendahara`, `Role`, `Total_Bayar`, `Status_Bayar`) hanya bergantung pada **No_Referensi** (sebagian dari composite key).
*   Atribut tagihan (`Kategori_Tagihan`, `Nominal_Tagihan`) hanya bergantung pada **Tagihan_ID** (sebagian dari composite key).
*   Hanya atribut **Nominal_Bayar** yang bergantung penuh pada kunci campuran **(No_Referensi, Tagihan_ID)** secara utuh.

Oleh karena itu, tabel 1NF dipecah menjadi beberapa entitas untuk menghilangkan ketergantungan parsial tersebut:

##### A. Tabel Pembayaran (Header Pembayaran)
*Menyimpan data umum transaksi pembayaran. Bergantung pada **No_Referensi**.*
*   **Struktur:** `No_Referensi (PK)`, `Tanggal_Bayar`, `NISN`, `Nama_Lengkap`, `Nama_Kelas`, `Instansi`, `Metode`, `User_ID (FK ke Bendahara)`, `Nama_Bendahara`, `Role`, `Total_Bayar`, `Status_Bayar`.

##### B. Tabel Detail Pembayaran (Rincian Pembayaran)
*Menghubungkan pembayaran dengan tagihan beserta jumlah alokasi nominal yang dibayar.*
*   **Struktur:** `Detail_ID (PK)`, `No_Referensi (FK)`, `Tagihan_ID (FK)`, `Nominal_Bayar`.

##### C. Tabel Tagihan
*Menyimpan kewajiban tagihan yang harus dibayar siswa.*
*   **Struktur:** `Tagihan_ID (PK)`, `NISN`, `Nama_Lengkap`, `Nama_Kelas`, `Instansi`, `Kategori_Tagihan`, `Nominal_Tagihan`.

##### D. Tabel Petugas/User
*Menyimpan data petugas yang mengelola sistem keuangan.*
*   **Struktur:** `User_ID (PK)`, `Nama_Bendahara`, `Role`.

---

#### 4. Bentuk Normal Ketiga (3NF)
Bentuk normal ketiga (3NF) terpenuhi apabila data berada dalam kondisi 2NF dan **menghilangkan ketergantungan transitif (transitive dependency)**. Atribut non-key tidak boleh bergantung pada atribut non-key lainnya; semua atribut non-key hanya boleh bergantung langsung pada Primary Key tabel tersebut.

Analisis Ketergantungan Transitif pada struktur 2NF:
1.  **Pada Tabel Pembayaran:** Atribut `Nama_Lengkap`, `Nama_Kelas`, dan `Instansi` bergantung pada `NISN`. Sementara `NISN` bergantung pada `No_Referensi`. Ini adalah ketergantungan transitif. Kita harus memisahkan data siswa ke tabel tersendiri (`siswas`).
2.  **Pada Tabel Siswa (`siswas`):** Atribut `Nama_Kelas` dan `Instansi` bergantung pada `Kelas_ID`, bukan langsung pada `Siswa_ID`. Ini harus dipisah ke tabel `kelas`.
3.  **Pada Tabel Tagihan:** Atribut `Kategori_Tagihan` bergantung pada `Kategori_Tagihan_ID`, bukan langsung pada `Tagihan_ID`. Ini dipisahkan ke tabel `kategori_tagihans`.
4.  **Pada Tabel Pembayaran:** Atribut `Nama_Bendahara` dan `Role` bergantung pada `User_ID`, sedangkan `User_ID` bergantung pada `No_Referensi`. Data pengguna dipisahkan ke tabel `users`.

Setelah menghilangkan ketergantungan transitif ini, terbentuklah struktur tabel yang bersih, efisien, bebas redundansi, dan **selaras dengan ERD & LRS fisik sistem**:

##### 1. Tabel `users` (Pusat Data Pengguna/Petugas/Wali)
*   `id (PK)`
*   `name` (Nama Bendahara / Pengguna)
*   `email`
*   `role` (Bendahara, Admin, dll)

##### 2. Tabel `kelas` (Data Kelas & Jenjang)
*   `id (PK)`
*   `nama_kelas` (misal: IX-A)
*   `instansi` (misal: SMP, SMA)

##### 3. Tabel `siswas` (Biodata Siswa)
*   `id (PK)`
*   `kelas_id (FK → kelas.id)`
*   `nisn`
*   `nama_lengkap`
*   `status` (aktif, nonaktif, dll)

##### 4. Tabel `kategori_tagihans` (Master Jenis Tagihan)
*   `id (PK)`
*   `nama_kategori` (misal: SPP Bulan Juli 2026)
*   `nominal_default`
*   `tipe_tagihan` (Bulanan / Sekali)

##### 5. Tabel `tagihans` (Transaksi Tagihan Per Siswa)
*   `id (PK)`
*   `siswa_id (FK → siswas.id)`
*   `kategori_tagihan_id (FK → kategori_tagihans.id)`
*   `nominal_tagihan`
*   `sisa_tagihan`
*   `status` (lunas, sebagian, belum_lunas)
*   `jatuh_tempo`

##### 6. Tabel `pembayarans` (Header Pembayaran)
*   `id (PK)`
*   `no_referensi`
*   `siswa_id (FK → siswas.id)`
*   `user_id (FK → users.id)` (Bendahara yang memverifikasi)
*   `total_bayar`
*   `metode_pembayaran` (tunai, transfer, qris)
*   `status_pembayaran` (menunggu, lunas, ditolak)
*   `tanggal_bayar`

##### 7. Tabel `detail_pembayarans` (Alokasi Rincian Pembayaran)
*   `id (PK)`
*   `pembayaran_id (FK → pembayarans.id)`
*   `tagihan_id (FK → tagihans.id)`
*   `nominal_bayar`

---

### PROSES BISNIS 2: TRANSAKSI TABUNGAN SISWA (MUTASI TABUNGAN)
Proses ini mencatat aktivitas siswa dalam menabung (setor) dan mengambil uang tabungan (tarik) untuk berbagai keperluan sekolah.

#### 1. Unnormalized Form (UNF)
Data dikumpulkan dari dokumen fisik berupa **Buku Tabungan / Kartu Kendali Tabungan** siswa yang berisi riwayat transaksi setor dan tarik yang berulang.

*   **Atribut Mentah:** NISN, Nama_Siswa, Kelas, Saldo_Rekening, [No_Mutasi, Tanggal_Mutasi, Jenis_Mutasi, Nominal_Mutasi, Saldo_Sebelum, Saldo_Sesudah, Petugas_ID, Nama_Petugas] (kelompok berulang).

---

#### 2. Bentuk Normal Kesatu (1NF)
Menghilangkan kelompok berulang pada buku tabungan dengan meratakan setiap baris mutasi ke kolom tersendiri.

| NISN | Nama_Siswa | Kelas | Saldo_Rekening | No_Mutasi | Tanggal_Mutasi | Jenis_Mutasi | Nominal_Mutasi | Saldo_Sebelum | Saldo_Sesudah | Petugas_ID | Nama_Petugas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **123456** | M. Rizky | IX-A | 500000 | **MUT-001** | 2026-05-18 | setor | 300000 | 200000 | 500000 | USR-02 | Budi Santoso |
| **123456** | M. Rizky | IX-A | 500000 | **MUT-002** | 2026-05-20 | tarik | 100000 | 500000 | 400000 | USR-02 | Budi Santoso |

> [!NOTE]
> **Composite Primary Key:** Kunci utama gabungan pada 1NF ini adalah **(NISN, No_Mutasi)**.

---

#### 3. Bentuk Normal Kedua (2NF)
Menghilangkan ketergantungan parsial.
*   Data profil rekening tabungan (`Saldo_Rekening`, `Nama_Siswa`, `Kelas`) hanya bergantung pada **NISN**.
*   Data transaksi mutasi (`Tanggal_Mutasi`, `Jenis_Mutasi`, `Nominal_Mutasi`, `Saldo_Sebelum`, `Saldo_Sesudah`, `Petugas_ID`, `Nama_Petugas`) hanya bergantung pada **No_Mutasi**.

Maka tabel dipecah menjadi:

##### A. Tabel Rekening Tabungan
*   **Struktur:** `NISN (PK)`, `Nama_Siswa`, `Kelas`, `Saldo_Rekening`.

##### B. Tabel Mutasi Tabungan
*   **Struktur:** `No_Mutasi (PK)`, `NISN (FK)`, `Tanggal_Mutasi`, `Jenis_Mutasi`, `Nominal_Mutasi`, `Saldo_Sebelum`, `Saldo_Sesudah`, `Petugas_ID`, `Nama_Petugas`.

---

#### 4. Bentuk Normal Ketiga (3NF)
Menghilangkan ketergantungan transitif agar data konsisten dan terintegrasi dengan tabel master yang sudah ada di sistem.
*   `Nama_Siswa` dan `Kelas` dipisahkan karena bergantung pada `NISN` (transitif). Siswa dihubungkan menggunakan `Siswa_ID` ke tabel `siswas`.
*   `Nama_Petugas` dipisahkan karena bergantung pada `Petugas_ID` (transitif). Petugas dihubungkan menggunakan `User_ID` ke tabel `users`.
*   Tabel Rekening Tabungan diberikan Primary Key berupa `Tabungan_ID` yang berelasi *one-to-one* dengan `Siswa_ID` pada tabel `siswas`.

Hasil akhir normalisasi 3NF untuk modul Tabungan yang **selaras 100% dengan LRS**:

##### 1. Tabel `tabungans` (Rekening Tabungan Siswa)
*   `id (PK)`
*   `siswa_id (FK → siswas.id, UNIQUE)` (Hubungan 1-to-1 dengan data siswa)
*   `saldo` (Saldo terkini pasca transaksi)

##### 2. Tabel `mutasi_tabungans` (Detail Mutasi Tabungan)
*   `id (PK)`
*   `tabungan_id (FK → tabungans.id)`
*   `user_id (FK → users.id)` (Petugas pemroses transaksi)
*   `jenis_mutasi` (ENUM: 'setor', 'tarik')
*   `nominal` (Jumlah setor/tarik)
*   `saldo_sebelum`
*   `saldo_sesudah`
*   `keperluan`
*   `tanggal_mutasi`

---

### RINGKASAN INTEGRITAS DATA HINGGA 3NF

| Tingkat Normalisasi | Tujuan Utama | Hasil / Bukti Pada Sistem |
| :--- | :--- | :--- |
| **Bentuk 1NF** | Menghilangkan Repeating Groups | Data kuitansi pembayaran dan mutasi tabungan diratakan sehingga setiap sel berisi nilai atomik tunggal. |
| **Bentuk 2NF** | Menghilangkan Partial Dependency | Pemisahan antara *Header Transaksi* (`pembayarans`, `tabungans`) dan *Rincian/Detail Transaksi* (`detail_pembayarans`, `mutasi_tabungans`). |
| **Bentuk 3NF** | Menghilangkan Transitive Dependency | Pemisahan data master akademik (`siswas`, `kelas`), data master keuangan (`kategori_tagihans`), dan pengguna (`users`) untuk menjamin tidak ada duplikasi data redundan. |
