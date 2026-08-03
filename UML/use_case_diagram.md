# Use Case Diagram Sistem 

Berikut adalah representasi Use Case Diagram dalam format Mermaid dengan gaya visual Kiri-Kanan (seperti referensi gambar dari Anda). 

1. **Garis Tanpa Panah**: Relasi menggunakan `---` (asosiasi solid), bukan panah.
2. **Layout Aktor Mengapit Sistem**: Aktor "Orang Tua", "Kepala Sekolah", dan "Yayasan" ditempatkan di KIRI, sementara "Admin" dan "Bendahara" ditempatkan di KANAN Sistem.
3. **Bentuk dan Warna Oval**: Use case dibentuk sebagai pill (`([Nama Use Case])`) lalu diwarna `#FFF2CC` mirip kuning terang sama persis dengan contoh di gambar.

> **Catatan Tambahan**: Mermaid.js pada dasarnya *flowchart based* dan belum mendukung ikon "Stick Figure" bawaan untuk use case. Sebagai alternatifnya, aktor disimbolkan dengan teks *bold* transparan beremosi agar tetap rapi. (Jika Anda ingin bentuk *stick figure* persis yang bisa di-render, alternatif terbaik format file-nya adalah *PlantUML*).

## Kode Mermaid Terbaru

```mermaid
flowchart LR
    %% ----------------------------------------------------
    %% 1. POSISI AKTOR DI KIRI
    %% ----------------------------------------------------
    Ortu(["👨‍👩‍👦 Orang Tua"])
    Kepsek(["🎓 Kepala Sekolah"])
    Yayasan(["🏢 Kepala Yayasan"])

    %% ----------------------------------------------------
    %% 2. BOUNDARY SISTEM (Kotak Di Tengah)
    %% ----------------------------------------------------
    subgraph Sistem ["Sistem Keuangan & Administrasi Sekolah"]
        %% Modul Umum
        UC_Login([Login & Logout])
        
        %% Modul Orang Tua & Laporan
        UC_InfoAnak([Lihat Profil Anak])
        UC_CekTagihan([Cek Rincian Tagihan])
        UC_RiwayatBayar([Lihat Riwayat Pembayaran])
        UC_LapSiswa([Pantau Laporan Pembayaran])
        UC_LapKeuangan([Laporan Keuangan & Arus Kas])
        UC_Dashboard([Dasbor Statistik])

        %% Modul Admin
        UC_Pengumuman([Kelola Pengumuman])
        UC_MasterData([Kelola Data Master])
        UC_ManUser([Kelola Data Pengguna])
        UC_Setting([Pengaturan Sistem])

        %% Modul Bendahara
        UC_Kategori([Kelola Kategori Tagihan])
        UC_Tagihan([Buat & Kirim Tagihan])
        UC_TerimaBayar([Proses Pembayaran])
        UC_Pengeluaran([Catat Pengeluaran])
        UC_Kwitansi([Cetak Kwitansi])
    end

    %% ----------------------------------------------------
    %% 3. POSISI AKTOR DI KANAN
    %% ----------------------------------------------------
    %% Aktor ini akan digeser ke Kanan menggunakan arah relasi (Dari Tabel menuju Aktor)
    Admin(["🧑‍💻 Admin"])
    Bendahara(["💰 Bendahara"])

    %% ----------------------------------------------------
    %% 4. RELASI AKTOR KIRI (Aktor --- Use Case)
    %% ----------------------------------------------------
    Ortu --- UC_Login
    Ortu --- UC_CekTagihan
    Ortu --- UC_RiwayatBayar
    Ortu --- UC_InfoAnak

    Kepsek --- UC_Login
    Kepsek --- UC_LapSiswa
    Kepsek --- UC_LapKeuangan
    Kepsek --- UC_Dashboard
    Kepsek --- UC_Pengumuman

    Yayasan --- UC_Login
    Yayasan --- UC_LapKeuangan
    Yayasan --- UC_Dashboard

    %% ----------------------------------------------------
    %% 5. RELASI AKTOR KANAN (Use Case --- Aktor)
    %% ----------------------------------------------------
    UC_Login --- Admin
    UC_MasterData --- Admin
    UC_ManUser --- Admin
    UC_Setting --- Admin
    UC_Pengumuman --- Admin

    UC_Login --- Bendahara
    UC_Kategori --- Bendahara
    UC_Tagihan --- Bendahara
    UC_TerimaBayar --- Bendahara
    UC_Pengeluaran --- Bendahara
    UC_Kwitansi --- Bendahara
    UC_LapSiswa --- Bendahara
    UC_LapKeuangan --- Bendahara

    %% ----------------------------------------------------
    %% 6. WARNA DAN TEMA SEPERTI DI GAMBAR (Styling)
    %% ----------------------------------------------------
    %% Mewarnai oval Use Case (warna krem/kuning muda) beserta outline
    classDef usecase fill:#FFF2CC,stroke:#D6B656,stroke-width:1.5px,color:#000
    class UC_Login,UC_MasterData,UC_ManUser,UC_Setting,UC_Pengumuman,UC_Kategori,UC_Tagihan,UC_TerimaBayar,UC_Pengeluaran,UC_Kwitansi,UC_LapSiswa,UC_LapKeuangan,UC_Dashboard,UC_CekTagihan,UC_RiwayatBayar,UC_InfoAnak usecase

    %% Membuat bingkai kotak sistem terlihat rapi (garis abu/hitam)
    classDef box fill:white,stroke:#000,stroke-width:1px,color:black
    class Sistem box
    
    %% Membuat font untuk Aktor tampak transparan backgroud-nya namun font tebal
    classDef actor fill:transparent,stroke:none,color:black,font-weight:bold
    class Ortu,Kepsek,Yayasan,Admin,Bendahara actor
```
