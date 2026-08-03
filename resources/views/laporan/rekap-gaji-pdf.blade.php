<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap Gaji Pegawai - {{ $namaBulan }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; }
        .header h1 { font-size: 16px; font-weight: bold; color: #1e3a5f; margin-bottom: 3px; }
        .header p { font-size: 11px; color: #666; }
        .meta-table { width: 100%; margin-bottom: 16px; font-size: 11px; }
        .meta-table td { padding: 2px 4px; }
        .meta-table .label { font-weight: bold; width: 130px; color: #555; }
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        table.data th { background: #1e3a5f; color: white; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        table.data td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        table.data tr:nth-child(even) td { background: #f8fafc; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .total-row td { font-weight: bold; background: #1e3a5f !important; color: white; padding: 10px; font-size: 12px; }
        .footer { margin-top: 30px; display: flex; justify-content: flex-end; }
        .signature-box { text-align: center; min-width: 200px; }
        .signature-name { margin-top: 60px; font-weight: bold; border-top: 1px solid #333; padding-top: 4px; }
    </style>
</head>
<body>

<div class="header">
    <h1>REKAPITULASI GAJI PEGAWAI</h1>
    <p>Periode: {{ $namaBulan }}</p>
</div>

<table class="meta-table">
    <tr>
        <td class="label">Tanggal Cetak</td>
        <td>: {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}</td>
        <td class="label">Dicetak Oleh</td>
        <td>: {{ $user->name ?? 'Administrator' }}</td>
    </tr>
    <tr>
        <td class="label">Total Pegawai Digaji</td>
        <td>: {{ $penggajians->count() }} orang</td>
        <td class="label">Total Anggaran</td>
        <td style="font-weight:bold; color:#1e3a5f;">: Rp {{ number_format($totalGaji, 0, ',', '.') }}</td>
    </tr>
</table>

<table class="data">
    <thead>
        <tr>
            <th width="4%" class="text-center">No</th>
            <th width="10%">NIP</th>
            <th width="22%">Nama Pegawai</th>
            <th width="15%">Instansi</th>
            <th width="12%" class="text-right">Gaji Pokok</th>
            <th width="12%" class="text-right">Tunjangan</th>
            <th width="12%" class="text-right">Potongan</th>
            <th width="13%" class="text-right">Total Gaji</th>
        </tr>
    </thead>
    <tbody>
        @forelse($penggajians as $index => $p)
        <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td>{{ $p->guru->nip ?? '-' }}</td>
            <td>{{ $p->guru->nama_guru ?? '-' }}</td>
            <td>{{ $p->guru->instansi ?? '-' }}</td>
            <td class="text-right">Rp {{ number_format($p->gaji_pokok ?? 0, 0, ',', '.') }}</td>
            <td class="text-right" style="color:#16a34a;">Rp {{ number_format($p->tunjangan ?? 0, 0, ',', '.') }}</td>
            <td class="text-right" style="color:#dc2626;">Rp {{ number_format($p->potongan ?? 0, 0, ',', '.') }}</td>
            <td class="text-right" style="font-weight:bold;">Rp {{ number_format($p->total_gaji ?? 0, 0, ',', '.') }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="8" class="text-center" style="padding:20px; color:#999;">Belum ada data gaji untuk periode ini.</td>
        </tr>
        @endforelse
        @if($penggajians->count() > 0)
        <tr class="total-row">
            <td colspan="7" class="text-right">TOTAL PENGELUARAN GAJI</td>
            <td class="text-right">Rp {{ number_format($totalGaji, 0, ',', '.') }}</td>
        </tr>
        @endif
    </tbody>
</table>

<div class="footer">
    <div class="signature-box">
        <p>Mengetahui,<br>Bendahara / Kepala Sekolah</p>
        <div class="signature-name">{{ $user->name ?? '...........................' }}</div>
    </div>
</div>

</body>
</html>
