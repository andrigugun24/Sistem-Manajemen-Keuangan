import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#e11d48', '#8b5cf6', '#3b82f6', '#64748b'];

export default function RekapKategori() {
    const { rekapKeluar = [], tahunAjaranAktif, tahunAjarans = [] } = usePage().props;

    const grandTotal = rekapKeluar.reduce((s, c) => s + Number(c.total || 0), 0);

    const categoryExpenses = rekapKeluar.map((item, i) => ({
        kategori: item.nama_kategori,
        total: Number(item.total || 0),
        jumlah: item.jumlah || 0,
        persen: grandTotal > 0 ? Math.round((Number(item.total || 0) / grandTotal) * 100) : 0,
        color: COLORS[i % COLORS.length],
    }));

    const chartData = categoryExpenses.map(c => ({ name: c.kategori, total: c.total / 1000000, fill: c.color }));
    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan', href: '#' }, { label: 'Analisis Kategori' }]}>
            <Head>
                <title>Analisis Kategori Pengeluaran</title>
            </Head>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analisis Kategori Pengeluaran</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                            Distribusi penggunaan dana per klasifikasi pos anggaran.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <select defaultValue={tahunAjaranAktif?.nama_tahun_ajaran} className="pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none outline-none transition-shadow shadow-sm cursor-pointer">
                                {tahunAjarans?.map(ta => (
                                    <option key={ta.id} value={ta.nama_tahun_ajaran}>Tahun Ajaran {ta.nama_tahun_ajaran}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                        <a href={route('laporan.rekap.pdf')} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-indigo-600/20">
                            <span className="material-symbols-outlined text-[20px]">ios_share</span>
                            <span>Cetak Eksekutif Laporan</span>
                        </a>
                    </div>
                </div>

                {/* Graph Card */}
                <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 mb-8 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-500 font-bold">sort</span>
                            Komparasi Pengeluaran (Dalam Juta Rupiah)
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} strokeOpacity={0.4} />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} unit=" Jt" dx={5} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} width={180} dx={-15} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    formatter={(value, name, props) => [`Rp ${value} Juta`, 'Total Biaya']}
                                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '12px 16px', fontWeight: 'bold' }}
                                    itemStyle={{ fontSize: '14px', color: '#0f172a' }}
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 'normal' }}
                                />
                                <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={32}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table Matrix */}
                <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-500 font-bold">table_view</span>
                            Matriks Data Pengeluaran
                        </h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[700px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-[#151724]/80 text-slate-500 dark:text-slate-400">
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Kategori Anggaran</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider w-[200px]">Akumulasi Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {categoryExpenses.map((cat, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm whitespace-nowrap">{cat.kategori}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-right font-bold text-slate-800 dark:text-white tabular-nums">
                                            Rp {formatNumber(cat.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-50 dark:bg-slate-900/80 border-t-2 border-slate-200 dark:border-slate-700">
                                    <td className="px-6 py-6 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400">functions</span>
                                        Total Pengeluaran Eksekutif
                                    </td>
                                    <td className="px-6 py-6 text-sm text-right font-extrabold text-indigo-600 dark:text-indigo-400 whitespace-nowrap tabular-nums text-lg">
                                        {formatRp(grandTotal)}
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
        </AuthenticatedLayout>
    );
}

