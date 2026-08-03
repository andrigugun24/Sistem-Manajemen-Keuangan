<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Buku Kas Umum - {{ $namaBulan }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #2c3e50;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #7f8c8d;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #bdc3c7;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            color: #2c3e50;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .text-green {
            color: #27ae60;
        }
        .text-red {
            color: #e74c3c;
        }
        .total-row th, .total-row td {
            font-weight: bold;
            background-color: #ecf0f1;
            font-size: 12px;
        }
        .footer {
            margin-top: 40px;
            text-align: right;
        }
        .footer p {
            margin: 0 0 50px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>{{ $judul }}</h2>
        <p>Periode: Bulan {{ $namaBulan }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="15%">Tanggal</th>
                <th width="35%">Keterangan</th>
                <th class="text-center" width="10%">No. Bukti / Ref</th>
                <th class="text-right" width="17.5%">Debit (Masuk)</th>
                <th class="text-right" width="17.5%">Kredit (Keluar)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transaksis as $index => $t)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($t->tanggal_transaksi)->translatedFormat('d F Y') }}</td>
                    <td>{{ $t->keterangan ?? ($t->kategoriKeuangan->nama_kategori ?? '-') }}</td>
                    <td class="text-center">{{ strtoupper($t->tipe_transaksi === 'masuk' ? 'KM' : 'KK') }}-{{ str_pad($t->id, 4, '0', STR_PAD_LEFT) }}</td>
                    <td class="text-right {{ $t->tipe_transaksi === 'masuk' ? 'text-green' : '' }}">
                        {{ $t->tipe_transaksi === 'masuk' ? 'Rp ' . number_format($t->nominal, 0, ',', '.') : '-' }}
                    </td>
                    <td class="text-right {{ $t->tipe_transaksi === 'keluar' ? 'text-red' : '' }}">
                        {{ $t->tipe_transaksi === 'keluar' ? 'Rp ' . number_format($t->nominal, 0, ',', '.') : '-' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada transaksi pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="4" class="text-right">TOTAL PERIODE INI</td>
                <td class="text-right text-green">Rp {{ number_format($totalMasuk, 0, ',', '.') }}</td>
                <td class="text-right text-red">Rp {{ number_format($totalKeluar, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="4" class="text-right">SALDO AKHIR KAS</td>
                <td colspan="2" class="text-right">Rp {{ number_format($saldoAkhir, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y H:i') }}</p>
        <p>Mengetahui,</p>
        <br><br><br>
        <p><strong>{{ $user->name ?? 'Administrator' }}</strong></p>
    </div>

</body>
</html>
