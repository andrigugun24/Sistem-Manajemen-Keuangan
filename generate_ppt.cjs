const pptxgen = require('pptxgenjs');
let pres = new pptxgen();

// Layout
pres.layout = 'LAYOUT_16x9';

// Define a brand color scheme
const COLOR_PRIMARY = '0F4C75'; // Dark blue
const COLOR_SECONDARY = '3282B8'; // Lighter blue
const COLOR_ACCENT = 'BBE1FA'; // Pale blue
const COLOR_TEXT = '1B262C'; // Dark text
const COLOR_WHITE = 'FFFFFF';
const COLOR_GRAY = 'F2F2F2';

// Define Master Slide
pres.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { color: 'FFFFFF' },
  objects: [
    // Top decorative bar
    { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: COLOR_PRIMARY } } },
    // Bottom decorative bar
    { rect: { x: 0, y: '97%', w: '100%', h: 0.15, fill: { color: COLOR_SECONDARY } } },
    // Logo (if available) - we'll try to add it.
    { image: { x: 0.1, y: 0.05, w: 0.7, h: 0.7, path: 'logoppl.png' } },
  ],
  slideNumber: { x: "96%", y: "93%", fontFace: "Arial", fontSize: 10, color: "888888" }
});

pres.defineSlideMaster({
  title: 'TITLE_SLIDE',
  background: { color: COLOR_PRIMARY },
  objects: [
    { circle: { x: -2, y: -2, w: 6, h: 6, fill: { color: COLOR_SECONDARY, transparency: 50 } } },
    { circle: { x: 7, y: 3, w: 5, h: 5, fill: { color: COLOR_ACCENT, transparency: 80 } } }
  ]
});

// SLIDE 1: TITLE
let slide1 = pres.addSlide({ masterName: 'TITLE_SLIDE' });
slide1.addText("RANCANG BANGUN SISTEM INFORMASI MANAJEMEN KEUANGAN TERINTEGRASI BERBASIS WEB", { x: 0.5, y: 1.2, w: 9, fontSize: 26, bold: true, align: 'center', color: COLOR_WHITE, fontFace: 'Segoe UI' });
slide1.addText("Studi Kasus: Pondok Pesantren Latahzan Citeras\nMenggunakan Framework Laravel dan React", { x: 0.5, y: 2.3, w: 9, fontSize: 18, align: 'center', color: COLOR_ACCENT, fontFace: 'Segoe UI' });
slide1.addShape(pres.ShapeType.line, { x: 4, y: 3.2, w: 2, h: 0, line: { color: COLOR_ACCENT, width: 2 } });
slide1.addText("PRESENTASI SKRIPSI", { x: 0.5, y: 3.5, w: 9, fontSize: 16, bold: true, align: 'center', color: COLOR_WHITE, charSpacing: 2 });
slide1.addText("Nama: Andri Gugun\nNIM: 221011402928\nTeknik Informatika - Universitas Pamulang", { x: 0.5, y: 4.2, w: 9, fontSize: 14, align: 'center', color: COLOR_WHITE, fontFace: 'Segoe UI' });

// SLIDE 2: Latar Belakang
let slide2 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide2.addText("Latar Belakang Masalah", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
slide2.addShape(pres.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.8, fill: { color: COLOR_GRAY }, roundness: true });
slide2.addText("Kondisi Eksisting: Pencatatan keuangan masih mengandalkan buku besar fisik secara konvensional.", { x: 0.6, y: 1.1, w: 8.8, fontSize: 16, color: COLOR_TEXT, bold: true, fontFace: 'Segoe UI' });

slide2.addText("Permasalahan Utama:", { x: 0.5, y: 2.2, w: 9, fontSize: 18, bold: true, color: COLOR_PRIMARY });
slide2.addText([
  { text: "Human Error:", options: { bold: true, color: 'e74c3c' } }, { text: " Tingginya risiko kesalahan perhitungan saldo akhir." }
], { x: 0.5, y: 2.7, w: 4.2, h: 1, fill: { color: 'FCECEB' }, fontSize: 14, margin: 10 });
slide2.addText([
  { text: "Lambatnya Rekapitulasi:", options: { bold: true, color: 'e67e22' } }, { text: " Laporan bulanan memakan waktu 2–3 hari." }
], { x: 5, y: 2.7, w: 4.2, h: 1, fill: { color: 'FDF3E9' }, fontSize: 14, margin: 10 });
slide2.addText([
  { text: "Pencarian Data Sulit:", options: { bold: true, color: 'f39c12' } }, { text: " Pelacakan riwayat tabungan memakan waktu 10–15 menit." }
], { x: 0.5, y: 4, w: 4.2, h: 1, fill: { color: 'FEF7EC' }, fontSize: 14, margin: 10 });
slide2.addText([
  { text: "Fragmentasi Data:", options: { bold: true, color: '9b59b6' } }, { text: " Pengelolaan SPP, tabungan, gaji guru terpisah." }
], { x: 5, y: 4, w: 4.2, h: 1, fill: { color: 'F7F1F9' }, fontSize: 14, margin: 10 });

// SLIDE 3
let slide3 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide3.addText("Rumusan & Batasan Masalah", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
// Left col
slide3.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fill: { color: COLOR_PRIMARY } });
slide3.addText("Rumusan Masalah", { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide3.addText("1. Merancang arsitektur sistem terintegrasi?\n2. Mengotomatisasi SPP, tabungan, gaji?\n3. Menyajikan laporan secara real-time?", { x: 0.5, y: 1.7, w: 4.2, h: 2, fontSize: 14, fill: { color: COLOR_GRAY }, margin: 15, bullet: { type: 'number' } });
// Right col
slide3.addShape(pres.ShapeType.rect, { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fill: { color: COLOR_SECONDARY } });
slide3.addText("Batasan Masalah", { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide3.addText("1. Diterapkan untuk operasional Yayasan Latahzan Citeras.\n2. Modul: SPP, Tabungan, Penggajian, Kas.\n3. Validasi pembayaran berbasis transfer manual oleh bendahara.", { x: 5.3, y: 1.7, w: 4.2, h: 2, fontSize: 14, fill: { color: COLOR_GRAY }, margin: 15, bullet: { type: 'number' } });

// SLIDE 4
let slide4 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide4.addText("Tujuan & Manfaat", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
slide4.addText("Tujuan Penelitian:", { x: 0.5, y: 1.2, w: 9, fontSize: 18, bold: true, color: COLOR_PRIMARY });
slide4.addText([
  { text: "Mengembangkan aplikasi manajemen keuangan berbasis web yang terintegrasi.", options: { bullet: { code: '2713', color: '27ae60' } } },
  { text: "Menerapkan algoritma komputasi otomatis untuk menghilangkan kesalahan hitung.", options: { bullet: { code: '2713', color: '27ae60' } } },
  { text: "Menyajikan laporan ekspor instan demi mempercepat pengambilan keputusan.", options: { bullet: { code: '2713', color: '27ae60' } } }
], { x: 0.5, y: 1.6, w: 9, fontSize: 16, color: COLOR_TEXT, margin: 5, lineSpacing: 30 });
slide4.addText("Manfaat:", { x: 0.5, y: 3.2, w: 9, fontSize: 18, bold: true, color: COLOR_SECONDARY });
slide4.addText([
  { text: "Bagi Pesantren:", options: { bold: true } }, { text: " Akselerasi efisiensi kerja bendahara & transparansi keuangan." }
], { x: 0.5, y: 3.8, w: 4.2, h: 1, fill: { color: 'E8F4F8' }, fontSize: 14, margin: 10 });
slide4.addText([
  { text: "Bagi Wali Santri:", options: { bold: true } }, { text: " Kemudahan dan kepastian informasi transaksi." }
], { x: 5, y: 3.8, w: 4.2, h: 1, fill: { color: 'E8F4F8' }, fontSize: 14, margin: 10 });

// SLIDE 5
let slide5 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide5.addText("Arsitektur Sistem (Modern Monolith)", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
slide5.addText("Komponen Teknologi", { x: 0.5, y: 1.2, w: 9, fontSize: 18, bold: true, color: COLOR_PRIMARY });
slide5.addText("Frontend\nReact JS", { x: 0.5, y: 1.8, w: 2, h: 1, fill: { color: '61DAFB' }, color: '000000', align: 'center', bold: true, margin:5 });
slide5.addText("↔", { x: 2.6, y: 2.1, w: 0.5, fontSize: 24, color: COLOR_PRIMARY });
slide5.addText("Bridge\nInertia.js", { x: 3.2, y: 1.8, w: 2, h: 1, fill: { color: '9553E9' }, color: COLOR_WHITE, align: 'center', bold: true, margin:5 });
slide5.addText("↔", { x: 5.3, y: 2.1, w: 0.5, fontSize: 24, color: COLOR_PRIMARY });
slide5.addText("Backend\nLaravel MVC", { x: 5.9, y: 1.8, w: 2, h: 1, fill: { color: 'FF2D20' }, color: COLOR_WHITE, align: 'center', bold: true, margin:5 });
slide5.addText("Database\nMySQL", { x: 5.9, y: 3.2, w: 2, h: 1, fill: { color: '00758F' }, color: COLOR_WHITE, align: 'center', bold: true, margin:5 });
slide5.addShape(pres.ShapeType.downArrow, { x: 6.75, y: 2.8, w: 0.3, h: 0.4, fill: { color: COLOR_PRIMARY } });

slide5.addText("Pendekatan Modern Monolith meminimalisir kompleksitas API eksternal.", { x: 0.5, y: 4.5, w: 9, fontSize: 14, color: COLOR_TEXT, italic: true });

// SLIDE 6
let slide6 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide6.addText("Metodologi & Pengujian", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });

slide6.addShape(pres.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.8, fill: { color: 'E8F4F8' } });
slide6.addText([
  { text: "Model Pengembangan: ", options: { bold: true, color: COLOR_PRIMARY } },
  { text: "AGILE (Perencanaan, Desain, Pengembangan, Pengujian, Evaluasi)", options: { color: COLOR_TEXT } }
], { x: 0.6, y: 1.1, w: 8.8, fontSize: 16 });

slide6.addText("Teknik Pengumpulan Data:", { x: 0.5, y: 2.2, w: 9, fontSize: 16, bold: true, color: COLOR_PRIMARY });
slide6.addText("Observasi langsung & Wawancara mendalam.", { x: 0.5, y: 2.6, w: 9, fontSize: 15, bullet: true, color: COLOR_TEXT });

slide6.addText("Metode Pengujian:", { x: 0.5, y: 3.3, w: 9, fontSize: 16, bold: true, color: COLOR_PRIMARY });
slide6.addText([
  { text: "Black Box Testing:", options: { bold: true } }, { text: " Fungsionalitas seluruh modul sistem." }
], { x: 0.5, y: 3.7, w: 9, fontSize: 15, bullet: { code: '25B6' } });
slide6.addText([
  { text: "White Box Testing:", options: { bold: true } }, { text: " Basis Path Testing (Cyclomatic Complexity)." }
], { x: 0.5, y: 4.2, w: 9, fontSize: 15, bullet: { code: '25B6' } });

// SLIDE 7
let slide7 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide7.addText("Perancangan Sistem (UML & DB)", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
// Use Case
slide7.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fill: { color: '34495e' } });
slide7.addText("Use Case Diagram", { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide7.addText([
  { text: "Admin/Bendahara:", options: { bold: true, color: COLOR_PRIMARY } },
  { text: " Mengelola penuh (Siswa, Tagihan, Tabungan, Kas, Laporan)\n\n" },
  { text: "Pimpinan Yayasan:", options: { bold: true, color: COLOR_PRIMARY } },
  { text: " Melihat Dashboard & Laporan." }
], { x: 0.5, y: 1.7, w: 4.2, h: 2, fontSize: 14, fill: { color: COLOR_GRAY }, margin: 15 });
// ERD
slide7.addShape(pres.ShapeType.rect, { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fill: { color: '2c3e50' } });
slide7.addText("Skema Relasi Basis Data", { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide7.addText([
  { text: "Tabel-tabel utama:\n", options: { bold: true, color: COLOR_PRIMARY } },
  { text: "• users, siswas, gurus\n" },
  { text: "• kategori_tagihans, tagihans\n" },
  { text: "• pembayarans, tabungans\n" },
  { text: "• mutasi_tabungans, kas_sekolahs" }
], { x: 5.3, y: 1.7, w: 4.2, h: 2, fontSize: 14, fill: { color: COLOR_GRAY }, margin: 15, lineSpacing: 25 });

// SLIDE 8
let slide8 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide8.addText("Modul & Fitur Utama (UI)", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });

slide8.addText("1", { x: 0.5, y: 1.2, w: 0.8, h: 0.8, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE, fontSize: 24, bold: true, align: 'center' });
slide8.addText([ { text: "Dashboard Utama:", options: { bold: true } }, { text: " Grafik performa keuangan & widget real-time." } ], { x: 1.5, y: 1.2, w: 7.5, h: 0.8, fontSize: 16, fill: { color: COLOR_GRAY }, margin: 10 });

slide8.addText("2", { x: 0.5, y: 2.2, w: 0.8, h: 0.8, fill: { color: COLOR_SECONDARY }, color: COLOR_WHITE, fontSize: 24, bold: true, align: 'center' });
slide8.addText([ { text: "Modul SPP & POS:", options: { bold: true } }, { text: " Form pembayaran kasir dan otomatisasi kuitansi." } ], { x: 1.5, y: 2.2, w: 7.5, h: 0.8, fontSize: 16, fill: { color: COLOR_GRAY }, margin: 10 });

slide8.addText("3", { x: 0.5, y: 3.2, w: 0.8, h: 0.8, fill: { color: '3498db' }, color: COLOR_WHITE, fontSize: 24, bold: true, align: 'center' });
slide8.addText([ { text: "Modul Tabungan Santri:", options: { bold: true } }, { text: " Pencatatan setor/tarik tunai & mutasi." } ], { x: 1.5, y: 3.2, w: 7.5, h: 0.8, fontSize: 16, fill: { color: COLOR_GRAY }, margin: 10 });

slide8.addText("4", { x: 0.5, y: 4.2, w: 0.8, h: 0.8, fill: { color: '2980b9' }, color: COLOR_WHITE, fontSize: 24, bold: true, align: 'center' });
slide8.addText([ { text: "Modul Data Master:", options: { bold: true } }, { text: " Manajemen kelas, siswa, guru, dan staf." } ], { x: 1.5, y: 4.2, w: 7.5, h: 0.8, fontSize: 16, fill: { color: COLOR_GRAY }, margin: 10 });

// SLIDE 9
let slide9 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide9.addText("Analisis Efisiensi & Hasil Uji", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
let rows = [
  [
    {text:'Aktivitas Administrasi', options:{bold:true, fill: COLOR_PRIMARY, color: COLOR_WHITE, fontSize: 14}}, 
    {text:'Cara Konvensional', options:{bold:true, fill: COLOR_PRIMARY, color: COLOR_WHITE, fontSize: 14}}, 
    {text:'Sistem Baru', options:{bold:true, fill: COLOR_PRIMARY, color: COLOR_WHITE, fontSize: 14}}, 
    {text:'Penghematan', options:{bold:true, fill: '27ae60', color: COLOR_WHITE, fontSize: 14}}
  ],
  ['Input SPP & Resi', '5 – 8 menit / santri', '< 30 detik', {text:'91.6%', options:{bold:true, color:'27ae60'}}],
  ['Rekap Laporan Bulanan', '2 – 3 hari', 'Instan', {text:'100%', options:{bold:true, color:'27ae60'}}],
  ['Pencarian Tabungan', '10 – 15 menit', '< 5 detik', {text:'99.3%', options:{bold:true, color:'27ae60'}}],
  ['Penggajian Guru', '4 – 5 jam', '10 – 15 menit', {text:'95.8%', options:{bold:true, color:'27ae60'}}]
];
slide9.addTable(rows, { x: 0.5, y: 1.2, w: 9, fill: COLOR_WHITE, fontSize: 14, color: COLOR_TEXT, border: {type:'solid', color:'dddddd', pt:1}, rowH: [0.6, 0.5, 0.5, 0.5, 0.5], align: 'center', valign: 'middle' });

slide9.addText("Hasil Black Box Testing: Seluruh 20 skenario pengujian utama (PASSED / Valid)", { x: 0.5, y: 4.2, w: 9, h: 0.8, fontSize: 16, fill: { color: 'E8F4F8' }, margin: 10, align: 'center', bold: true, color: COLOR_PRIMARY });

// SLIDE 10
let slide10 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
slide10.addText("Kesimpulan & Saran", { x: 1.0, y: 0.15, w: 8, fontSize: 24, bold: true, color: COLOR_WHITE });
slide10.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fill: { color: '27ae60' } });
slide10.addText("Kesimpulan", { x: 0.5, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide10.addText([
  { text: "Sistem Manajemen Keuangan Terintegrasi berhasil dibangun dengan ", options: { color: COLOR_TEXT } },
  { text: "Laravel, React, dan Inertia.js.\n", options: { bold: true, color: COLOR_PRIMARY } },
  { text: "Pengolahan data terbukti memotong durasi birokrasi ", options: { color: COLOR_TEXT } },
  { text: ">90%", options: { bold: true, color: '27ae60' } },
  { text: " dan mencapai akurasi kalkulasi ", options: { color: COLOR_TEXT } },
  { text: "100%.", options: { bold: true, color: '27ae60' } }
], { x: 0.5, y: 1.7, w: 4.2, h: 2, fontSize: 16, fill: { color: COLOR_GRAY }, margin: 15, bullet: { code: '2713', color: '27ae60' }, lineSpacing: 25 });

slide10.addShape(pres.ShapeType.rect, { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fill: { color: 'f39c12' } });
slide10.addText("Saran Pengembangan", { x: 5.3, y: 1.2, w: 4.2, h: 0.5, fontSize: 16, bold: true, color: COLOR_WHITE, align: 'center' });
slide10.addText([
  { text: "Penambahan integrasi Payment Gateway otomatis.\n" },
  { text: "Integrasi Notifikasi WhatsApp Gateway untuk penagihan.\n" },
  { text: "Portal cek saldo tabungan mandiri bagi siswa/orang tua." }
], { x: 5.3, y: 1.7, w: 4.2, h: 2, fontSize: 15, fill: { color: COLOR_GRAY }, margin: 15, bullet: { code: '2728', color: 'f39c12' }, lineSpacing: 25 });


// SLIDE 11
let slide11 = pres.addSlide({ masterName: 'TITLE_SLIDE' });
slide11.addText("TERIMA KASIH", { x: 0.5, y: 1.5, w: 9, fontSize: 48, bold: true, align: 'center', color: COLOR_WHITE, fontFace: 'Segoe UI' });
slide11.addText("Sesi Tanya Jawab (Q&A)", { x: 0.5, y: 2.5, w: 9, fontSize: 24, align: 'center', color: COLOR_ACCENT, fontFace: 'Segoe UI' });
slide11.addShape(pres.ShapeType.line, { x: 3.5, y: 3.2, w: 3, h: 0, line: { color: COLOR_ACCENT, width: 2 } });
slide11.addText("Andri Gugun\nandrigugun@mhs.unpam.ac.id", { x: 0.5, y: 3.8, w: 9, fontSize: 18, align: 'center', color: COLOR_WHITE, fontFace: 'Segoe UI' });

pres.writeFile({ fileName: "presentasi_menarik.pptx" }).then(() => {
    console.log("created presentasi_menarik.pptx");
});
