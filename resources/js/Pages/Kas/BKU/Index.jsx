import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function BKUIndex() {
    const { transaksis = { data: [] }, stats = {}, bosStats = {}, bosTransaksis = [], filters = {} } = usePage().props;
    const [activeTab, setActiveTab] = useState('umum');
    const bosTransaksisList = Array.isArray(bosTransaksis) ? bosTransaksis : [];

    const bulan = filters.bulan ? String(filters.bulan).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');
    const tahun = filters.tahun || new Date().getFullYear();
    const [periode, setPeriode] = useState(`${tahun}-${bulan}`);

    const handleFilterPeriode = (val) => {
        setPeriode(val);
        const [y, m] = val.split('-');
        router.get(route('kas.bku'), { bulan: m, tahun: y }, { preserveState: true, replace: true });
    };

    const bkuUmumData = (transaksis.data || []).map(row => ({
        id: row.id,
        tanggal: row.tanggal_transaksi ? new Date(row.tanggal_transaksi).toLocaleDateString('id-ID') : '-',
        kode: row.tipe_transaksi === 'masuk' ? 'KM' : 'KK',
        uraian: row.keterangan || (row.kategori_keuangan?.nama_kategori || '-'),
        masuk: row.tipe_transaksi === 'masuk' ? row.nominal : 0,
        keluar: row.tipe_transaksi === 'keluar' ? row.nominal : 0,
        saldo: 0,
    }));



    const totalMasukUmum = stats.totalMasuk || 0;
    const totalKeluarUmum = stats.totalKeluar || 0;
    const saldoAkhirUmum = stats.saldo || 0;

    const renderTabUmum = () => (
        <>
            {/* Stat Cards BKU Umum */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Pemasukan Debit */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/30 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl text-emerald-600">trending_up</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <span className="material-symbols-outlined">arrow_downward</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Total Pemasukan (Debit)</p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalMasukUmum)}</h3>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +12% dari bulan lalu
                        </p>
                    </div>
                </div>

                {/* Total Pengeluaran Kredit */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-rose-500/30 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl text-rose-600">trending_down</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <span className="material-symbols-outlined">arrow_upward</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Total Pengeluaran (Kredit)</p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalKeluarUmum)}</h3>
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 w-fit px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">trending_down</span>
                            +5% dari bulan lalu
                        </p>
                    </div>
                </div>

                {/* Saldo Akhir Kas */}
                <div className="bg-gradient-to-br from-[#5340f1] to-[#3a2db3] text-white rounded-2xl p-6 border border-[#5340f1] shadow-lg shadow-indigo-500/20 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-white dark:bg-slate-900 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-8xl text-white">account_balance</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900/20 backdrop-blur-sm flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">wallet</span>
                        </div>
                        <p className="text-indigo-100 font-medium">Saldo Akhir Kas</p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">Rp {formatNumber(saldoAkhirUmum)}</h3>
                        <p className="text-xs font-semibold text-indigo-100 mt-2 flex items-center gap-1.5 bg-white dark:bg-slate-900/20 backdrop-blur-sm w-fit px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">verified_user</span>
                            Kondisi Keuangan Aman
                        </p>
                    </div>
                </div>
            </div>

            {/* Table BKU Umum */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Transaksi</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input 
                                type="month" 
                                value={periode} 
                                onChange={(e) => handleFilterPeriode(e.target.value)} 
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer" 
                            />
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">calendar_month</span>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#1a1c2e] text-slate-500 dark:text-slate-400">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[120px]">Tanggal</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[120px]">No. Ref</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[300px]">Uraian Transaksi</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-[180px]">Debit (Masuk)</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-[180px]">Kredit (Keluar)</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-[180px]">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {bkuUmumData.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 tabular-nums">{row.tanggal}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono text-xs">{row.kode}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 font-semibold">{row.uraian}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-right tabular-nums">
                                        {row.masuk > 0 ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded inline-block w-full">
                                                Rp {formatNumber(row.masuk)}
                                            </span>
                                        ) : <span className="text-slate-300 dark:text-slate-600 dark:text-slate-400">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right tabular-nums">
                                        {row.keluar > 0 ? (
                                            <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded inline-block w-full">
                                                Rp {formatNumber(row.keluar)}
                                            </span>
                                        ) : <span className="text-slate-300 dark:text-slate-600 dark:text-slate-400">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right tabular-nums">Rp {formatNumber(row.saldo)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50/80 dark:bg-[#1a1c2e] border-t border-slate-200 dark:border-slate-700">
                            <tr>
                                <td colSpan="3" className="px-6 py-5 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-right">TOTAL PERIODE INI</td>
                                <td className="px-6 py-5 text-sm font-extrabold text-emerald-700 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 text-right tabular-nums">Rp {formatNumber(totalMasukUmum)}</td>
                                <td className="px-6 py-5 text-sm font-extrabold text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10 text-right tabular-nums">Rp {formatNumber(totalKeluarUmum)}</td>
                                <td className="px-6 py-5 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 border-l border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-900/10 text-right tabular-nums">Rp {formatNumber(saldoAkhirUmum)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );

    const renderTabBos = () => {
        const bosMasukTotal = bosStats.totalMasuk || 0;
        const bosKeluarTotal = bosStats.totalKeluar || 0;
        const bosSaldo = bosStats.saldo || 0;
        const bosPersenTerserap = bosMasukTotal > 0 ? Math.round((bosKeluarTotal / bosMasukTotal) * 100) : 0;

        return (
            <>
                {/* Stat Cards Dana BOS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Dana Masuk BOS */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-[#0fbdae]">account_balance_wallet</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Dana BOS Masuk (Bulan Ini)</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Rp {formatNumber(bosMasukTotal)}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                            Total Penerimaan Dana BOS
                        </div>
                    </div>

                    {/* Dana Keluar BOS */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-blue-500">payments</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Dana BOS Keluar (Bulan Ini)</p>
                            <h3 className="text-3xl font-extrabold text-rose-600 tracking-tight">Rp {formatNumber(bosKeluarTotal)}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            {bosPersenTerserap}% Terserap
                        </div>
                    </div>

                    {/* Sisa Saldo BOS */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between overflow-hidden">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Saldo Dana BOS</p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Rp {formatNumber(bosSaldo)}</h3>
                            </div>
                            <p className="text-xs font-medium text-slate-400 mt-4">Sisa dana BOS yang tersedia</p>
                        </div>
                        <div className="relative w-24 h-24 shrink-0">
                            <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                <path className="text-[#0fbdae]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${bosPersenTerserap}, 100`} strokeLinecap="round" strokeWidth="4"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{bosPersenTerserap}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Transaksi Dana BOS */}
                <div className="bg-white dark:bg-[#151724] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="text-center py-6 px-4 border-b border-slate-200/60 dark:border-slate-800/50">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-[#0fbdae] shadow-inner">
                                <span className="material-symbols-outlined text-[28px]">school</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Transaksi Dana BOS</h2>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1 rounded-full">Periode: Bulan {bulan} Tahun {tahun}</p>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 dark:bg-[#1a1c2e] text-white">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-[120px] border-r border-slate-700 dark:border-slate-800">Tanggal</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider border-r border-slate-700 dark:border-slate-800">Keterangan</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-[100px] text-center border-r border-slate-700 dark:border-slate-800">Tipe</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right w-48 border-r border-slate-700 dark:border-slate-800">Masuk (Rp)</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right w-48">Keluar (Rp)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800/60">
                                {bosTransaksisList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Belum ada transaksi Dana BOS bulan ini</td>
                                    </tr>
                                )}
                                {bosTransaksisList.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium text-sm tabular-nums">
                                            {row.tanggal_transaksi ? new Date(row.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">{row.keterangan || row.kategori_keuangan?.nama_kategori || '-'}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${row.tipe_transaksi === 'masuk' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'}`}>
                                                {row.tipe_transaksi === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold tabular-nums">
                                            {row.tipe_transaksi === 'masuk' ? (
                                                <span className="text-emerald-600 dark:text-emerald-400">Rp {formatNumber((row.nominal || 0))}</span>
                                            ) : <span className="text-slate-300 dark:text-slate-600">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold tabular-nums">
                                            {row.tipe_transaksi === 'keluar' ? (
                                                <span className="text-rose-600 dark:text-rose-400">Rp {formatNumber((row.nominal || 0))}</span>
                                            ) : <span className="text-slate-300 dark:text-slate-600">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-100/50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-700">
                                <tr className="font-black text-slate-900 dark:text-white">
                                    <td colSpan="3" className="py-5 px-6 font-bold text-right uppercase tracking-wider text-sm">TOTAL</td>
                                    <td className="py-5 px-6 text-right font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums border-l border-white dark:border-slate-900">Rp {formatNumber(bosMasukTotal)}</td>
                                    <td className="py-5 px-6 text-right font-extrabold text-rose-700 dark:text-rose-400 tabular-nums border-l border-white dark:border-slate-900">Rp {formatNumber(bosKeluarTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <Head title="Buku Kas Umum" />

            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Laporan Buku Kas</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Periode Laporan: <span className="text-slate-900 dark:text-slate-300 font-bold">Bulan {bulan} Tahun {tahun}</span></p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={route('kas.bku.pdf') + `?bulan=${bulan}&tahun=${tahun}&jenis=${activeTab}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span>Cetak Laporan</span>
                    </a>
                    <a
                        href={route('kas.bku.excel') + `?bulan=${bulan}&tahun=${tahun}&jenis=${activeTab}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-600/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">table_view</span>
                        <span>Export Excel</span>
                    </a>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 mt-4">
                <button
                    onClick={() => setActiveTab('umum')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors focus:outline-none ${activeTab === 'umum'
                        ? 'border-[#5340f1] text-[#5340f1] dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Kas Umum
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('bos')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors focus:outline-none ${activeTab === 'bos'
                        ? 'border-[#0fbdae] text-[#0fbdae] dark:text-[#0fbdae] bg-emerald-50/50 dark:bg-[#0fbdae]/10 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">school</span> Dana BOS
                    </div>
                </button>
            </div>

            <div className="w-full max-w-[1600px] mx-auto pb-10">
                {activeTab === 'umum' ? renderTabUmum() : renderTabBos()}
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

BKUIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Kas Sekolah', href: '#' }, { label: 'Buku Kas Umum' }]}>
        {page}
    </AuthenticatedLayout>
);
