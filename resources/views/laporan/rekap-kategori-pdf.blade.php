<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Rekap Kategori Keuangan</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h2 { margin: 0; font-size: 18px; }
        .header p { margin: 5px 0 0 0; font-size: 12px; }
        .title { text-align: center; margin-bottom: 15px; font-weight: bold; font-size: 14px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f4f4f5; font-weight: bold; text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .footer { position: fixed; bottom: -20px; left: 0; right: 0; font-size: 10px; text-align: right; color: #666; }
        .section-title { font-weight: bold; font-size: 13px; margin-bottom: 10px; background: #e0e7ff; padding: 5px; }
        .total-row th { background-color: #f1f5f9; font-weight: bold; }
    </style>
</head>
<body>

    <div class="header">
        <h2>Laporan Rekapitulasi Kategori Keuangan</h2>
        <p>Yayasan Pendidikan Terpadu</p>
    </div>

    <div class="title">Analisis Pos Anggaran Pemasukan & Pengeluaran</div>

    <div class="section-title">A. Kategori Pemasukan</div>
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="50%">Kategori Pemasukan</th>
                <th width="20%" class="text-center">Jumlah Transaksi</th>
                <th width="25%" class="text-right">Total Akumulasi (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rekapMasuk as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->nama_kategori }}</td>
                <td class="text-center">{{ $item->jumlah }}</td>
                <td class="text-right">{{ number_format($item->total, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" class="text-center">Belum ada data pemasukan.</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total-row">
                <th colspan="2" class="text-right">Total Keseluruhan Pemasukan:</th>
                <th class="text-center">{{ collect($rekapMasuk)->sum('jumlah') }}</th>
                <th class="text-right">{{ number_format(collect($rekapMasuk)->sum('total'), 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>

    <div class="section-title" style="background: #ffe4e6;">B. Kategori Pengeluaran</div>
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="50%">Kategori Pengeluaran</th>
                <th width="20%" class="text-center">Jumlah Transaksi</th>
                <th width="25%" class="text-right">Total Akumulasi (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rekapKeluar as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->nama_kategori }}</td>
                <td class="text-center">{{ $item->jumlah }}</td>
                <td class="text-right">{{ number_format($item->total, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" class="text-center">Belum ada data pengeluaran.</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total-row">
                <th colspan="2" class="text-right">Total Keseluruhan Pengeluaran:</th>
                <th class="text-center">{{ collect($rekapKeluar)->sum('jumlah') }}</th>
                <th class="text-right">{{ number_format(collect($rekapKeluar)->sum('total'), 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Dicetak oleh: {{ $user->name ?? 'Administrator' }} | Tanggal: {{ \Carbon\Carbon::now()->format('d M Y H:i') }}
    </div>

</body>
</html>
