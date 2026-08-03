<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Buku Tabungan - {{ $tabungan->siswa->nama_lengkap ?? 'Siswa' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
        }
        .subtitle {
            font-size: 14px;
            margin: 0;
            color: #555;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 4px;
            vertical-align: top;
        }
        .info-label {
            font-weight: bold;
            width: 120px;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table.data th, table.data td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table.data th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .text-right {
            text-align: right !important;
        }
        .text-center {
            text-align: center !important;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 11px;
        }
        .signature-area {
            width: 100%;
            margin-top: 40px;
        }
        .signature-box {
            float: right;
            width: 250px;
            text-align: center;
        }
        .signature-name {
            margin-top: 70px;
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">BUKU TABUNGAN SISWA</h1>
        <p class="subtitle">Riwayat Mutasi Saldo</p>
    </div>

    <table class="info-table">
        <tr>
            <td class="info-label">Nama Siswa</td>
            <td>: {{ $tabungan->siswa->nama_lengkap ?? '-' }}</td>
            <td class="info-label">Tanggal Cetak</td>
            <td>: {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}</td>
        </tr>
        <tr>
            <td class="info-label">NISN</td>
            <td>: {{ $tabungan->siswa->nisn ?? '-' }}</td>
            <td class="info-label">Dicetak Oleh</td>
            <td>: {{ $user->name ?? 'Administrator' }}</td>
        </tr>
        <tr>
            <td class="info-label">Kelas</td>
            <td>: {{ $tabungan->siswa->kelas->nama_kelas ?? '-' }}</td>
            <td class="info-label">Saldo Akhir</td>
            <td style="font-weight: bold; font-size: 14px;">: Rp {{ number_format($tabungan->saldo, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="info-label">Total Setoran</td>
            <td style="color: #16a34a; font-weight: bold;">: Rp {{ number_format($totalSetoran ?? 0, 0, ',', '.') }}</td>
            <td class="info-label">Total Penarikan</td>
            <td style="color: #dc2626; font-weight: bold;">: Rp {{ number_format($totalPenarikan ?? 0, 0, ',', '.') }}</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th width="5%" class="text-center">No</th>
                <th width="20%">Tanggal</th>
                <th width="20%">Jenis Mutasi</th>
                <th width="25%" class="text-right">Nominal (Rp)</th>
                <th width="30%" class="text-right">Saldo Sesudah (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($mutasis as $index => $mutasi)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ \Carbon\Carbon::parse($mutasi->tanggal_mutasi)->translatedFormat('d M Y') }}</td>
                <td>
                    {{ $mutasi->jenis_mutasi === 'setor' ? 'Setoran' : 'Penarikan' }}
                </td>
                <td class="text-right">
                    {{ $mutasi->jenis_mutasi === 'setor' ? '+' : '-' }}
                    {{ number_format($mutasi->nominal, 0, ',', '.') }}
                </td>
                <td class="text-right">{{ number_format($mutasi->saldo_sesudah, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center">Belum ada riwayat mutasi tabungan.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature-area">
        <div class="signature-box">
            <p>Mengetahui,<br>Petugas / Bendahara</p>
            <div class="signature-name">
                {{ $user->name ?? '...........................' }}
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>
