import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BookOpen, Search, Filter, Printer, Download } from 'lucide-react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function BukuKasUmumIndex() {
    // Dummy Data
    const ringkasan = {
        saldoAwalBulan: 12500000,
        totalPemasukan: 15450000,
        totalPengeluaran: 8500000,
        saldoAkhir: 19450000
    };

    // Data campuran masuk & keluar terurut tanggal
    const riwayatBKU = [
        { id: 1, tanggal: '01 Feb 2026', tipe: 'masuk', kategori: 'Saldo Awal', keterangan: 'Pindahan saldo bulan lalu', nominal: 12500000, saldoBawaan: 12500000, kode: '-' },
        { id: 2, tanggal: '05 Feb 2026', tipe: 'keluar', kategori: 'Pemeliharaan', keterangan: 'Perbaikan atap bocor ruang kelas 3', nominal: 1000000, saldoBawaan: 11500000, kode: 'KK-2602-001' },
        { id: 3, tanggal: '10 Feb 2026', tipe: 'keluar', kategori: 'Konsumsi Rapat', keterangan: 'Rapat koordinasi awal bulan guru & staf', nominal: 750000, saldoBawaan: 10750000, kode: 'KK-2602-002' },
        { id: 4, tanggal: '15 Feb 2026', tipe: 'masuk', kategori: 'Lain-lain', keterangan: 'Penjualan barang bekas prakarya', nominal: 500000, saldoBawaan: 11250000, kode: 'KM-2602-004' },
        { id: 5, tanggal: '18 Feb 2026', tipe: 'keluar', kategori: 'Honor', keterangan: 'Honor pelatih Pramuka dan Paskibra', nominal: 2000000, saldoBawaan: 9250000, kode: 'KK-2602-003' },
        { id: 6, tanggal: '20 Feb 2026', tipe: 'masuk', kategori: 'Sewa Fasilitas', keterangan: 'Sewa kantin sekolah bulan Februari', nominal: 1500000, saldoBawaan: 10750000, kode: 'KM-2602-003' },
        { id: 7, tanggal: '22 Feb 2026', tipe: 'keluar', kategori: 'Listrik & Air', keterangan: 'Pembayaran tagihan listrik Februari', nominal: 3500000, saldoBawaan: 7250000, kode: 'KK-2602-004' },
        { id: 8, tanggal: '24 Feb 2026', tipe: 'masuk', kategori: 'Dana BOS', keterangan: 'Pencairan BOS Pusat Tahap 1', nominal: 5250000, saldoBawaan: 12500000, kode: 'KM-2602-002' },
        { id: 9, tanggal: '25 Feb 2026', tipe: 'masuk', kategori: 'Bantuan', keterangan: 'Donasi dari Hamba Allah untuk perbaikan AC', nominal: 2500000, saldoBawaan: 15000000, kode: 'KM-2602-001' },
        { id: 10, tanggal: '26 Feb 2026', tipe: 'keluar', kategori: 'ATK & Cetak', keterangan: 'Beli kertas HVS dan isi ulang tinta printer TU', nominal: 1250000, saldoBawaan: 13750000, kode: 'KK-2602-005' },
    ];

    return (
        <>
            <Head title="Buku Kas Umum" />

            <div className="space-y-6 pb-12">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-500 bg-blue-100 p-1 rounded-lg" />
                            Buku Kas Umum (BKU)
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rekapitulasi seluruh mutasi penambahan dan pengurangan kas sekolah</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                            <Printer className="w-4 h-4" /> Cetak
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95">
                            <Download className="w-4 h-4" /> Export Excel
                        </button>
                    </div>
                </div>

                {/* Ringkasan BKU */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 rounded-2xl p-5 text-white">
                        <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Saldo Awal (Feb)</p>
                        <h3 className="text-xl font-bold">{formatRp(ringkasan.saldoAwalBulan)}</h3>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
                        <p className="text-xs font-semibold text-emerald-600/80 mb-1 uppercase tracking-wider">Total Masuk</p>
                        <h3 className="text-xl font-bold text-emerald-700">+{formatRp(ringkasan.totalPemasukan)}</h3>
                    </div>
                    <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                        <p className="text-xs font-semibold text-red-600/80 mb-1 uppercase tracking-wider">Total Keluar</p>
                        <h3 className="text-xl font-bold text-red-700">-{formatRp(ringkasan.totalPengeluaran)}</h3>
                    </div>
                    <div className="bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 p-5 text-white">
                        <p className="text-xs font-semibold text-blue-200 mb-1 uppercase tracking-wider">Saldo Akhir</p>
                        <h3 className="text-xl font-bold">{formatRp(ringkasan.saldoAkhir)}</h3>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50">
                        <div className="md:col-span-2 relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari uraian, kode referensi..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option value="">Semua Kas / Sumber</option>
                                <option value="umum">Hanya Kas Umum</option>
                                <option value="bos">Hanya Kas BOS</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option value="02-2026">Februari 2026</option>
                                <option value="01-2026">Januari 2026</option>
                                <option value="12-2025">Desember 2025</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-center w-16">NO</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">TGL & REFF</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">URAIAN / KETERANGAN</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">PENERIMAAN (DEBET)</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">PENGELUARAN (KREDIT)</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">SALDO</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {riwayatBKU.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-center text-slate-400">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 dark:text-white">{row.tanggal}</div>
                                            {row.kode !== '-' && <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">{row.kode}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 dark:text-white">{row.keterangan}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {row.tipe === 'masuk' ? (
                                                <span className="text-emerald-600 font-bold">{formatRp(row.nominal)}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {row.tipe === 'keluar' ? (
                                                <span className="text-red-600 font-bold">{formatRp(row.nominal)}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-slate-900 dark:text-white font-bold">{formatRp(row.saldoBawaan)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 font-bold">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 uppercase">Total Mutasi Bulan Ini</td>
                                    <td className="px-6 py-4 text-right text-emerald-600">{formatRp(ringkasan.totalPemasukan)}</td>
                                    <td className="px-6 py-4 text-right text-red-600">{formatRp(ringkasan.totalPengeluaran)}</td>
                                    <td className="px-6 py-4 text-right text-slate-900 dark:text-white">{formatRp(ringkasan.saldoAkhir)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

BukuKasUmumIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Kas Sekolah', href: '#' }, { label: 'Buku Kas Umum' }]}>
        {page}
    </AuthenticatedLayout>
);
