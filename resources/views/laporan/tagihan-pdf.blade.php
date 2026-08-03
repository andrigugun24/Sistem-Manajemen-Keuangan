<!DOCTYPE html>
<html>

<head>
    <title>Laporan Tagihan Siswa</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h2 {
            margin: 0;
            padding: 0;
            font-size: 18px;
        }

        .header p {
            margin: 5px 0 0 0;
            font-size: 11px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th,
        table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            vertical-align: top;
        }

        table th {
            background-color: #e5e7eb;
            font-weight: bold;
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .summary {
            margin-top: 25px;
            width: 40%;
            float: right;
            padding: 10px;
            border: 1px solid #000;
        }

        .summary-table {
            width: 100%;
            border: none;
            margin-top: 0;
        }

        .summary-table th,
        .summary-table td {
            border: none;
            padding: 5px 0;
            text-align: left;
        }

        .summary-table td.amount {
            text-align: right;
            font-weight: bold;
        }

        .text-green {
            color: #166534;
        }

        .text-red {
            color: #991b1b;
        }

        .badge {
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10px;
            display: inline-block;
            font-weight: bold;
        }

        .bg-light {
            background-color: #f3f4f6;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>LAPORAN REKAPITULASI TAGIHAN SISWA</h2>
        <p><strong>Periode Jatuh Tempo :</strong>
            {{ $startDate && $endDate ? $startDate . ' s/d ' . $endDate : 'Semua Waktu' }} &nbsp; | &nbsp;
            <strong>Kategori :</strong> {{ $kategoriName }}</p>
        <p><strong>Status Tagihan :</strong>
            @if($statusFilter == 'all') Semua Status
            @elseif($statusFilter == 'lunas') Sudah Lunas
            @elseif($statusFilter == 'belum_lunas') Belum Lunas
            @else Sebagian @endif
            &nbsp; | &nbsp;
            <strong>Cetak Oleh :</strong> {{ $user ? $user->name . ' (' . ucfirst($user->role) . ')' : 'Sistem' }}
            &nbsp; | &nbsp; <strong>Tanggal Cetak :</strong> {{ \Carbon\Carbon::now()->translatedFormat('d F Y, H:i') }}
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%">No</th>
                <th width="15%">Nama Siswa</th>
                <th width="8%">Kelas</th>
                <th width="15%">Kategori Tagihan</th>
                <th width="12%">Jatuh Tempo</th>
                <th width="12%" class="text-right">Nominal (Rp)</th>
                <th width="12%" class="text-right">Terbayar (Rp)</th>
                <th width="12%" class="text-right">Sisa (Rp)</th>
                <th width="10%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tagihans as $index => $t)
                @php
                    $terbayar = $t->nominal_tagihan - $t->sisa_tagihan;
                    $statusBadge = '';
                    if ($t->status === 'lunas')
                        $statusBadge = 'Lunas';
                    else if ($t->status === 'sebagian')
                        $statusBadge = 'Sebagian';
                    else
                        $statusBadge = 'Belum Lunas';
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $t->siswa ? $t->siswa->nama_lengkap : 'Siswa Dihapus' }}</td>
                    <td class="text-center">{{ $t->siswa && $t->siswa->kelas ? $t->siswa->kelas->nama_kelas : '-' }}</td>
                    <td>{{ $t->kategoriTagihan ? $t->kategoriTagihan->nama_kategori : '-' }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($t->jatuh_tempo)->translatedFormat('d M Y') }}</td>
                    <td class="text-right">{{ number_format($t->nominal_tagihan, 0, ',', '.') }}</td>
                    <td class="text-right text-green">{{ number_format($terbayar, 0, ',', '.') }}</td>
                    <td class="text-right {{ $t->sisa_tagihan > 0 ? 'text-red' : '' }}">
                        {{ $t->sisa_tagihan > 0 ? number_format($t->sisa_tagihan, 0, ',', '.') : '-' }}</td>
                    <td class="text-center"><strong>{{ $statusBadge }}</strong></td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center bg-light">Tidak ada data tagihan pada filter ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <h4 style="margin-top: 0; padding-bottom: 5px; border-bottom: 1px solid #000; text-align: center;">RINGKASAN
            TUNGGAKAN</h4>
        <table class="summary-table">
            <tr>
                <th>Total Proyeksi Penerimaan</th>
                <td class="amount">Rp {{ number_format($totalTagihan, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <th>Total Terkumpul / Lunas</th>
                <td class="amount text-green">Rp {{ number_format($totalTerkumpul, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="2">
                    <hr style="border: 0.5px solid #ccc;">
                </td>
            </tr>
            <tr>
                <th>Tunggakan </th>
                <td class="amount text-red" style="font-size: 13px;">Rp {{ number_format($totalSisa, 0, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
</body>

</html>