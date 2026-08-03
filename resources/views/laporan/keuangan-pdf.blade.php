<!DOCTYPE html>
<html>
<head>
    <title>Laporan Keuangan</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0; padding: 0; font-size: 18px; }
        .header p { margin: 5px 0 0 0; font-size: 11px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table th, table td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
        table th { background-color: #e5e7eb; font-weight: bold; text-align: center; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-top: 25px; width: 40%; float: right; padding: 10px; border: 1px solid #000; }
        .summary-table { width: 100%; border: none; margin-top: 0; }
        .summary-table th, .summary-table td { border: none; padding: 5px 0; text-align: left; }
        .summary-table td.amount { text-align: right; font-weight: bold; }
        .text-green { color: #166534; }
        .text-red { color: #991b1b; }
        .badge { padding: 3px 6px; border-radius: 4px; font-size: 10px; display: inline-block; font-weight: bold;}
        .bg-light { background-color: #f3f4f6; }
    </style>
</head>
<body>
    <div class="header">
        <h2>LAPORAN KEUANGAN YAYASAN</h2>
        <p><strong>Periode Laporan :</strong> {{ $startDate && $endDate ? $startDate . ' s/d ' . $endDate : 'Semua Waktu' }}</p>
        <p><strong>Cetak Oleh :</strong> {{ $user ? $user->name . ' (' . ucfirst($user->role) . ')' : 'Sistem' }} &nbsp; | &nbsp; <strong>Tanggal Cetak :</strong> {{ \Carbon\Carbon::now()->translatedFormat('d F Y, H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%">No</th>
                <th width="10%">Tanggal</th>
                <th width="12%">No. Referensi</th>
                <th width="8%">Tipe</th>
                <th width="12%">Kategori</th>
                <th width="25%">Uraian & Keterangan</th>
                <th width="10%">Metode</th>
                <th width="8%">Status</th>
                <th width="12%" class="text-right">Nominal (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transaksis as $index => $t)
                @php
                    // Set default referensi data
                    $no_ref = 'TRX-' . str_pad($t->id, 4, '0', STR_PAD_LEFT);
                    $metode = '-';
                    $status = 'Lunas'; // Default untuk TR Umum
                    $detail_keterangan = $t->keterangan;

                    if($t->referensi_type == 'App\Models\Pembayaran' && $t->referensi) {
                        $pembayaran = $t->referensi;
                        $no_ref = $pembayaran->no_referensi ?? $no_ref;
                        $metode = ucfirst($pembayaran->metode_pembayaran);
                        $status = ucfirst($pembayaran->status_pembayaran);
                        
                        if($pembayaran->siswa) {
                            $kelasName = $pembayaran->siswa->kelas ? $pembayaran->siswa->kelas->nama_kelas : '-';
                            $detail_keterangan = "Pembayaran " . ($t->kategoriKeuangan ? $t->kategoriKeuangan->nama_kategori : '') . " dari " . $pembayaran->siswa->nama_lengkap . " (Kelas: " . $kelasName . ")";
                        }
                    } elseif ($t->referensi_type == 'App\Models\Penggajian' && $t->referensi) {
                        $penggajian = $t->referensi;
                        $status = ucfirst($penggajian->status);
                        
                        if($penggajian->guru) {
                            $detail_keterangan = "Gaji " . \Carbon\Carbon::create()->month($penggajian->bulan)->translatedFormat('F') . ' ' . $penggajian->tahun . " - " . $penggajian->guru->nama_guru;
                        }
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($t->tanggal_transaksi)->translatedFormat('d M Y') }}</td>
                    <td style="font-family: monospace;">{{ $no_ref }}</td>
                    <td class="text-center">{{ ucfirst($t->tipe_transaksi) }}</td>
                    <td>{{ $t->kategoriKeuangan ? $t->kategoriKeuangan->nama_kategori : '-' }}</td>
                    <td>{{ $detail_keterangan ?? '-' }}</td>
                    <td class="text-center">{{ $metode }}</td>
                    <td class="text-center">{{ $status }}</td>
                    <td class="text-right {{ $t->tipe_transaksi == 'masuk' ? 'text-green' : 'text-red' }}">
                        {{ $t->tipe_transaksi == 'keluar' ? '-' : '' }} {{ number_format($t->nominal, 0, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center bg-light">Tidak ada data transaksi pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <h4 style="margin-top: 0; padding-bottom: 5px; border-bottom: 1px solid #000; text-align: center;">RINGKASAN</h4>
        <table class="summary-table">
            <tr>
                <th>Total Pemasukan (Debit)</th>
                <td class="amount text-green">Rp {{ number_format($totalMasuk, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <th>Total Pengeluaran (Kredit)</th>
                <td class="amount text-red">Rp {{ number_format($totalKeluar, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="2"><hr style="border: 0.5px solid #ccc;"></td>
            </tr>
            <tr>
                <th>Saldo Akhir Bersih</th>
                <td class="amount" style="font-size: 13px;">Rp {{ number_format($saldo, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
