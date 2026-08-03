import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function KasKeluarIndex() {
    const kasKeluarData = [
        { id: 1, tanggal: '19/02/2026', kode: 'KK-001', kategori: 'ATK & Perlengkapan', penerima: 'Toko Maju Jaya', nominal: 1500000, keterangan: 'Pembelian kertas dan tinta', status: 'verified' },
        { id: 2, tanggal: '18/02/2026', kode: 'KK-002', kategori: 'Listrik & Air', penerima: 'PLN', nominal: 2800000, keterangan: 'Tagihan listrik Februari', status: 'verified' },
        { id: 3, tanggal: '15/02/2026', kode: 'KK-003', kategori: 'Pemeliharaan Gedung', penerima: 'CV Bangun Jaya', nominal: 4500000, keterangan: 'Perbaikan atap ruang kelas', status: 'verified' },
        { id: 4, tanggal: '10/02/2026', kode: 'KK-004', kategori: 'Kegiatan Siswa', penerima: 'Panitia OSIS', nominal: 3000000, keterangan: 'Lomba 17 Agustus', status: 'pending' },
        { id: 5, tanggal: '05/02/2026', kode: 'KK-005', kategori: 'Transportasi', penerima: 'Travel ABC', nominal: 2000000, keterangan: 'Studi wisata kelas 6', status: 'verified' },
    ];

    const totalKeluarBulanIni = kasKeluarData.filter(d => d.status === 'verified').reduce((s, d) => s + d.nominal, 0);
    const totalPending = kasKeluarData.filter(d => d.status === 'pending').reduce((s, d) => s + d.nominal, 0);

    return (
        <>
            <Head title="Kas Keluar" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kas Keluar (Pengeluaran)</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Pencatatan dan monitoring aliran dana operasional keluar.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-rose-600/20">
                        <span className="material-symbols-outlined text-[20px]">remove_circle</span>
                        <span>Catat Pengeluaran</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-rose-500/30 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl text-rose-600">arrow_upward</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <span className="material-symbols-outlined">shopping_cart_checkout</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Pengeluaran Tervalidasi (Feb)</p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalKeluarBulanIni)}</h3>
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 w-fit px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Dana telah ditarik dari BKU
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-amber-500/30 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl text-amber-600">hourglass_empty</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Menunggu Verifikasi (Pending)</p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(totalPending)}</h3>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 w-fit px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            Menunggu persetujuan
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-shadow" type="text" placeholder="Cari kode atau penerima..." />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-sm whitespace-nowrap">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">filter_alt</span>
                        Filter:
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-40">
                            <select className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 appearance-none outline-none transition-shadow">
                                <option>Semua Kategori</option>
                                <option>ATK & Perlengkapan</option>
                                <option>Listrik & Air</option>
                                <option>Pemeliharaan Gedung</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                        <div className="relative w-full sm:w-40">
                            <input type="month" defaultValue="2026-02" className="w-full pl-3 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 appearance-none outline-none transition-shadow" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Table */}
            <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-[#151724]/80 text-slate-500 dark:text-slate-400">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[120px]">Tanggal</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[120px]">Kode Ref</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-[180px]">Kategori</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Penerima & Keterangan</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-[180px]">Nominal Keluar</th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider w-[150px]">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {kasKeluarData.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 tabular-nums">{row.tanggal}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono text-xs">{row.kode}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${row.kategori === 'Listrik & Air' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' :
                                            row.kategori === 'ATK & Perlengkapan' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800' :
                                                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                            }`}>
                                            {row.kategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{row.penerima}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{row.keterangan}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right tabular-nums">
                                        <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1.5 rounded inline-block w-full text-right tracking-tight">
                                            Rp {formatNumber(row.nominal)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${row.status === 'verified'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                            }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {row.status === 'verified' ? 'check_circle' : 'pending'}
                                            </span>
                                            {row.status === 'verified' ? 'Terverifikasi' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all" title="Edit">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all" title="Hapus">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

KasKeluarIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Kas Sekolah', href: '#' }, { label: 'Kas Keluar' }]}>
        {page}
    </AuthenticatedLayout>
);

