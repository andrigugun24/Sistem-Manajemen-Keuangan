import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, usePage, router } from '@inertiajs/react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRp } from '@/utils/formatRupiah';

export default function LaporanDashboard() {
    const { stats = {}, chartData = [], kategoriData = [], filters = {} } = usePage().props;

    const currentYear = new Date().getFullYear();
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun || currentYear);

    const handleFilterTahun = (tahun) => {
        setSelectedTahun(tahun);
        router.get(route('laporan.dashboard'), { tahun }, { preserveState: true, replace: true });
    };

    const tahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan', href: '#' }, { label: 'Dashboard Analitik' }]}>
            <Head>
                <title>Dashboard Analitik</title>
            </Head>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pusat Analitik Keuangan</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                            Visualisasi data eksekutif untuk arus kas operasional dan distribusi pengeluaran.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {/* Filter Periode (Tahun) — sekarang fungsional */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
                            <span className="material-symbols-outlined text-[20px] text-slate-500">calendar_month</span>
                            <select
                                value={selectedTahun}
                                onChange={e => handleFilterTahun(parseInt(e.target.value))}
                                className="bg-transparent text-slate-700 dark:text-slate-200 text-sm font-bold focus:outline-none cursor-pointer"
                            >
                                {tahunOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {/* Tombol Unduh — link ke PDF laporan keuangan */}
                        <a
                            href={route('laporan.keuangan.pdf') + `?tahun=${selectedTahun}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-indigo-600/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            <span>Unduh Laporan</span>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Pemasukan" value={formatRp(stats.totalPemasukan)} icon="trending_up" color="emerald" subtitle="Seluruh periode" />
                    <StatCard title="Total Pengeluaran" value={formatRp(stats.totalPengeluaran)} icon="trending_down" color="red" subtitle="Seluruh periode" />
                    <StatCard title="Surplus Bersih" value={formatRp(stats.surplus)} icon="account_balance_wallet" color="indigo" subtitle="Margin Operasional" />
                    <StatCard title="Tingkat Kepatuhan SPP" value={`${stats.kepatuhanSPP || 0}%`} icon="verified_user" color="blue" subtitle="Persentase lunas" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Area Chart — Tren Pemasukan & Pengeluaran */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-indigo-500 font-bold">stacked_line_chart</span>
                                Tren Pemasukan &amp; Pengeluaran {selectedTahun}
                            </h3>
                        </div>
                        <div className="h-[320px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                        <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dx={-10} tickFormatter={(value) => value >= 1000000 ? `${value / 1000000} Jt` : (value >= 1000 ? `${value / 1000} Rb` : value)} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                                            itemStyle={{ fontSize: '13px' }}
                                            labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 'normal' }}
                                            formatter={(value, name) => [formatRp(value), name]}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} />
                                        <Area type="monotone" dataKey="masuk" name="Pemasukan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                                        <Area type="monotone" dataKey="keluar" name="Pengeluaran" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorKeluar)" activeDot={{ r: 6, strokeWidth: 0, fill: '#e11d48' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-5xl mb-3">bar_chart</span>
                                    <p className="text-sm font-medium">Belum ada data transaksi untuk tahun {selectedTahun}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
