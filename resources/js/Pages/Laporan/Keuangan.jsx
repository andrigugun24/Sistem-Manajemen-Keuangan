import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, Download, Printer, Filter, X } from 'lucide-react';
import ChickenBankIcon from '@/Components/ChickenBankIcon';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function LaporanKeuangan() {
    const { transaksis = {}, stats = {} } = usePage().props;

    // Get current URL params for initial state
    const params = new URLSearchParams(window.location.search);
    const [startDate, setStartDate] = useState(params.get('start_date') || '');
    const [endDate, setEndDate] = useState(params.get('end_date') || '');

    const handleFilter = () => {
        router.get(route('laporan.keuangan'), {
            start_date: startDate,
            end_date: endDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const laporanData = (transaksis.data || []).map((t, i) => {
        let uraian = t.keterangan || '-';
        let ref = `TRX-${String(t.id).padStart(4, '0')}`;
        let metode = '-';
        let status = 'Lunas';

        if (t.referensi && t.referensi_type === 'App\\Models\\Pembayaran') {
            const pem = t.referensi;
            ref = pem.no_referensi || ref;
            metode = pem.metode_pembayaran === 'tunai' ? 'Tunai' : 'Transfer';
            status = pem.status_pembayaran === 'lunas' ? 'Lunas' : 'Tertunda';
            
            if (pem.siswa) {
                const kelasName = pem.siswa.kelas ? pem.siswa.kelas.nama_kelas : '-';
                uraian = `Pembayaran ${t.kategori_keuangan?.nama_kategori || ''} dari ${pem.siswa.nama_lengkap} (Kelas: ${kelasName})`;
            }
        } else if (t.referensi && t.referensi_type === 'App\\Models\\Penggajian') {
            status = 'Lunas';
            if (t.referensi.guru) {
                // periode_bulan format: "8-2026" -> split to get month and year
                const parts = (t.referensi.periode_bulan || '').split('-');
                const bulanNum = parseInt(parts[0]) || new Date().getMonth() + 1;
                const tahunNum = parseInt(parts[1]) || new Date().getFullYear();
                const namaBulan = new Date(tahunNum, bulanNum - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                uraian = `Gaji Bulan ${namaBulan} - ${t.referensi.guru.nama_guru}`;
            }
        }

        return {
            id: t.id,
            tanggal: t.tanggal_transaksi ? new Date(t.tanggal_transaksi).toLocaleDateString('id-ID') : '-',
            uraian: uraian,
            ref: ref,
            kategori: t.tipe_transaksi === 'masuk' ? 'Penerimaan' : 'Pengeluaran',
            spesifik: t.kategori_keuangan?.nama_kategori || '-',
            masuk: t.tipe_transaksi === 'masuk' ? t.nominal : 0,
            keluar: t.tipe_transaksi === 'keluar' ? t.nominal : 0,
            metode: metode,
            status: status
        };
    });

    const totalMasuk = stats.totalMasuk || 0;
    const totalKeluar = stats.totalKeluar || 0;

    return (
        <>
            <Head>
                <title>Buku Besar Keuangan</title>
            </Head>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Buku Besar Keuangan (Ledger)</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                            Catatan komprehensif seluruh arus kas untuk audit dan transparansi.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-1.5 shadow-sm">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-3 py-1.5 bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 focus:ring-0 w-[130px]"
                            />
                            <span className="text-slate-400 text-sm">s/d</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-1.5 bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 focus:ring-0 w-[130px]"
                            />
                            <button onClick={handleFilter} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">search</span>
                            </button>
                        </div>
                        <a 
                            href={`${route('laporan.keuangan.pdf')}?start_date=${startDate}&end_date=${endDate}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-indigo-600/20 h-[46px]"
                        >
                            <span className="material-symbols-outlined text-[20px]">print</span>
                            <span>Cetak PDF</span>
                        </a>
                    </div>
                </div>

                {/* Ledger Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <span className="material-symbols-outlined absolute right-0 top-0 text-9xl text-emerald-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all -rotate-12 translate-x-4 -translate-y-4">account_balance</span>
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-[24px]">south_east</span>
                            </div>
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">Total Kredit (Pemasukan)</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalMasuk)}</p>
                        </div>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200/60 dark:border-rose-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <span className="material-symbols-outlined absolute right-0 top-0 text-9xl text-rose-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all rotate-12 translate-x-4 -translate-y-4">account_balance_wallet</span>
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-800/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <span className="material-symbols-outlined text-[24px]">north_east</span>
                            </div>
                            <p className="font-bold text-rose-700 dark:text-rose-400">Total Debit (Pengeluaran)</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalKeluar)}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <ChickenBankIcon className="absolute right-0 top-0 w-32 h-32 text-indigo-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all translate-x-4 -translate-y-4" />
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined text-[24px]">drag_indicator</span>
                            </div>
                            <p className="font-bold text-indigo-700 dark:text-indigo-400">Keseimbangan Rasio Margin</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber((totalMasuk - totalKeluar))}</p>
                        </div>
                    </div>
                </div>

                {/* Main Ledger Table */}
                <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none" type="text" placeholder="Cari transaksi ledger..." />
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[1200px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-[#151724]/80 border-y border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[120px]">Tanggal</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[140px]">No. Referensi</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Uraian Transaksi</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[140px]">Kategori</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider w-[120px]">Metode / Status</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider w-[160px]">Kredit (Masuk)</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider w-[160px]">Debit (Keluar)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
                                {laporanData.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">{row.tanggal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <span className="material-symbols-outlined text-[14px] text-slate-400">receipt</span>
                                                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">{row.ref}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{row.uraian}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${row.kategori === 'Penerimaan'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
                                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800'
                                                }`}>
                                                {row.spesifik}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <div className="font-semibold text-slate-700 dark:text-slate-300">{row.metode}</div>
                                            <div className={`text-[11px] font-bold mt-0.5 ${row.status === 'Lunas' ? 'text-emerald-500' : 'text-amber-500'}`}>{row.status}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums tracking-tight">
                                            {row.masuk > 0 ? (
                                                <div className="flex items-center justify-end gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded w-fit ml-auto">
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    Rp {formatNumber(row.masuk)}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 dark:text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-extrabold text-rose-600 dark:text-rose-400 whitespace-nowrap tabular-nums tracking-tight">
                                            {row.keluar > 0 ? (
                                                <div className="flex items-center justify-end gap-1.5 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded w-fit ml-auto">
                                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                                    Rp {formatNumber(row.keluar)}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 dark:text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-50 dark:bg-[#151724]/60 border-t-2 border-slate-200 dark:border-slate-700">
                                    <td colSpan="5" className="px-6 py-6 text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-right flex items-center justify-end gap-2">
                                        <span className="material-symbols-outlined text-slate-400">functions</span>
                                        Grand Total Ledger
                                    </td>
                                    <td className="px-6 py-6 text-sm text-right font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap tabular-nums text-lg underline decoration-emerald-200 dark:decoration-emerald-800 underline-offset-4">
                                        Rp {formatNumber(totalMasuk)}
                                    </td>
                                    <td className="px-6 py-6 text-sm text-right font-black text-rose-700 dark:text-rose-400 whitespace-nowrap tabular-nums text-lg underline decoration-rose-200 dark:decoration-rose-800 underline-offset-4">
                                        Rp {formatNumber(totalKeluar)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </>
    );
}

LaporanKeuangan.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan', href: '#' }, { label: 'Buku Besar Keuangan' }]}>
        {page}
    </AuthenticatedLayout>
);

