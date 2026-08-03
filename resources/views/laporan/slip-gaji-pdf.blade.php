<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji - {{ $guru->nama_guru ?? '-' }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 12px;
            color: #000;
            margin: 0;
            padding: 10px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        
        .header {
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0 0 5px 0;
            letter-spacing: 2px;
        }
        
        .info-table {
            width: 100%;
            margin-bottom: 15px;
        }
        .info-table td {
            padding: 3px 0;
            vertical-align: top;
        }
        .info-table .label {
            width: 120px;
        }
        .info-table .colon {
            width: 10px;
        }

        .details-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .details-container td {
            vertical-align: top;
            width: 50%;
            padding: 0;
        }
        .details-container td.left-col {
            padding-right: 10px;
        }
        .details-container td.right-col {
            padding-left: 10px;
        }

        .rincian-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
        }
        .rincian-table th {
            background-color: #f0f0f0;
            border-bottom: 1px solid #000;
            padding: 6px;
            text-align: left;
        }
        .rincian-table td {
            padding: 6px;
            border-bottom: 1px dotted #ccc;
        }
        .rincian-table .subtotal {
            border-top: 1px solid #000;
            border-bottom: none;
            font-weight: bold;
        }

        .thp-box {
            border: 2px solid #000;
            padding: 10px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
        }
        .thp-title {
            font-size: 12px;
            font-weight: bold;
        }
        .thp-amount {
            font-size: 18px;
            font-weight: bold;
            margin-top: 5px;
        }

        .signature-table {
            width: 100%;
            margin-top: 30px;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
            height: 80px;
        }
        .signature-line {
            display: inline-block;
            width: 200px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 20px;
            font-size: 10px;
            color: #666;
            border-top: 1px dashed #ccc;
            padding-top: 5px;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header text-center">
        <h1 class="uppercase font-bold">SLIP GAJI</h1>
    </div>

    <!-- Informasi Pegawai -->
    @php
        $parts = explode('-', $penggajian->periode_bulan);
        $bulanNum = $parts[0] ?? date('n');
        $tahunNum = $parts[1] ?? date('Y');
        $periodeStr = \Carbon\Carbon::createFromDate($tahunNum, $bulanNum, 1)->translatedFormat('F Y');
    @endphp
    
    <table class="info-table">
        <tr>
            <td class="label">Nama Pegawai</td>
            <td class="colon">:</td>
            <td class="font-bold">{{ $guru->nama_guru ?? '-' }}</td>
            
            <td class="label">Periode</td>
            <td class="colon">:</td>
            <td class="font-bold uppercase">{{ $periodeStr }}</td>
        </tr>
        <tr>
            <td class="label">NIP / NIK</td>
            <td class="colon">:</td>
            <td>{{ $guru->nip ?? '-' }}</td>
            
            <td class="label">Instansi / Jabatan</td>
            <td class="colon">:</td>
            <td>{{ $guru->instansi ?? 'GTT' }}</td>
        </tr>
    </table>

    <!-- Rincian Gaji (2 Kolom) -->
    <table class="details-container">
        <tr>
            <!-- Kolom Kiri: PENERIMAAN -->
            <td class="left-col">
                <table class="rincian-table">
                    <tr>
                        <th colspan="2">PENERIMAAN</th>
                    </tr>
                    <tr>
                        <td>Gaji Pokok / Honor</td>
                        <td class="text-right">Rp {{ number_format($penggajian->gaji_pokok ?? 0, 0, ',', '.') }}</td>
                    </tr>
                    @if(!empty($penggajian->detail_tunjangan))
                        @foreach($penggajian->detail_tunjangan as $tunjangan)
                        <tr>
                            <td>{{ $tunjangan['nama'] ?? '-' }}</td>
                            <td class="text-right">Rp {{ number_format($tunjangan['nominal'] ?? 0, 0, ',', '.') }}</td>
                        </tr>
                        @endforeach
                    @endif
                    <tr>
                        <td class="subtotal">Total Penerimaan</td>
                        <td class="text-right subtotal">Rp {{ number_format(($penggajian->gaji_pokok ?? 0) + ($penggajian->tunjangan ?? 0), 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
            
            <!-- Kolom Kanan: POTONGAN -->
            <td class="right-col">
                <table class="rincian-table">
                    <tr>
                        <th colspan="2">POTONGAN</th>
                    </tr>
                    @if(!empty($penggajian->detail_potongan) && count($penggajian->detail_potongan) > 0)
                        @foreach($penggajian->detail_potongan as $potongan)
                        <tr>
                            <td>{{ $potongan['nama'] ?? '-' }}</td>
                            <td class="text-right">Rp {{ number_format($potongan['nominal'] ?? 0, 0, ',', '.') }}</td>
                        </tr>
                        @endforeach
                    @else
                        <tr>
                            <td>Tidak ada potongan</td>
                            <td class="text-right">-</td>
                        </tr>
                    @endif
                    <tr>
                        <td class="subtotal">Total Potongan</td>
                        <td class="text-right subtotal">Rp {{ number_format($penggajian->potongan ?? 0, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Take Home Pay -->
    <div class="thp-box">
        <table style="width: 100%;">
            <tr>
                <td>
                    <div class="thp-title">TAKE HOME PAY (GAJI BERSIH)</div>
                    <div style="font-size: 10px; margin-top: 3px;">(Total Penerimaan dikurangi Total Potongan)</div>
                </td>
                <td class="text-right">
                    <div class="thp-amount">Rp {{ number_format($penggajian->total_gaji ?? 0, 0, ',', '.') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Tanda Tangan -->
    @php
        $tanggalCetak = $penggajian->tanggal_pembayaran 
            ? \Carbon\Carbon::parse($penggajian->tanggal_pembayaran)->translatedFormat('d F Y') 
            : \Carbon\Carbon::now()->translatedFormat('d F Y');
    @endphp
    <table class="signature-table">
        <tr>
            <td>
                <div>Penerima,</div>
                <br><br><br>
                <div class="signature-line">{{ $guru->nama_guru ?? '-' }}</div>
            </td>
            <td>
                <div>Mengetahui, <br> Bendahara / Kepala Sekolah</div>
                <br><br><br>
                <div class="signature-line">{{ $user->name ?? 'Bendahara' }}</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        Dicetak otomatis oleh sistem pada tanggal {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}
    </div>

</body>
</html>
