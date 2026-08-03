import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatRp } from '@/utils/formatRupiah';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Users, GraduationCap } from 'lucide-react';

export default function KepalaYayasanDashboard() {
    const { stats = {}, fundDistribution = [], performaUnit = [], auth } = usePage().props;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const userName = auth?.user?.name || 'Kepala Yayasan';

    const saldoPositif = (stats.saldoKas || 0) >= 0;

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
            <Head title="Dashboard Kepala Yayasan" />

            <div className="space-y-6 pb-12 max-w-[1400px]">
                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang, {userName}</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{today}</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Saldo Kas</span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${saldoPositif ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}>
                                <Wallet className={`w-4 h-4 ${saldoPositif ? 'text-emerald-600' : 'text-rose-600'}`} />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold tracking-tight ${saldoPositif ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>{formatRp(stats.saldoKas)}</p>
                        <p className="text-xs text-slate-400 mt-1">Akumulasi seluruh kas</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Pemasukan</span>
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatRp(stats.totalPemasukan)}</p>
                        <p className="text-xs text-slate-400 mt-1">Seluruh kas masuk</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Pengeluaran</span>
                            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatRp(stats.totalPengeluaran)}</p>
                        <p className="text-xs text-slate-400 mt-1">Seluruh kas keluar</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Tunggakan</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatRp(stats.totalTunggakan)}</p>
                        <p className="text-xs text-slate-400 mt-1">Tagihan belum lunas</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribusi Sumber Dana */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
                        <div className="mb-5">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Distribusi Sumber Dana</h3>
                            <p className="text-[13px] text-slate-400 mt-0.5">Proporsi pemasukan per kategori</p>
                        </div>
                        {fundDistribution && fundDistribution.length > 0 ? (
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0 w-[160px] h-[160px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={fundDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                                                {fundDistribution.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {fundDistribution.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-[13px] text-slate-600 dark:text-slate-400">{item.name}</span>
                                            </div>
                                            <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Belum ada data pemasukan</div>
                        )}
                    </div>

                    {/* Performa Per Unit */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
                        <div className="mb-5">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Performa Per Unit</h3>
                            <p className="text-[13px] text-slate-400 mt-0.5">Realisasi tagihan per instansi</p>
                        </div>
                        <div className="space-y-5">
                            {performaUnit && performaUnit.length > 0 ? (
                                performaUnit.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{item.unit}</span>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />{item.siswa} siswa</span>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.progress >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : (item.progress >= 50 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400')}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${item.progress >= 80 ? 'bg-emerald-500' : (item.progress >= 50 ? 'bg-amber-500' : 'bg-rose-500')}`}
                                                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 w-8 text-right">{item.progress}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-400 text-center py-6">
                                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                    <p>Belum ada data unit/instansi.</p>
                                    <p className="text-xs mt-1">Pastikan field instansi terisi pada data siswa.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
                    <h3 className="text-[14px] font-semibold text-slate-700 dark:text-slate-300 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Dashboard Laporan', href: route('laporan.dashboard'), icon: 'analytics' },
                            { label: 'Laporan Keuangan', href: route('laporan.keuangan'), icon: 'receipt_long' },
                            { label: 'Tagihan Siswa', href: route('laporan.tagihan'), icon: 'request_quote' },
                            { label: 'Rekap Kategori', href: route('laporan.rekap'), icon: 'category' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-center group">
                                <span className="material-symbols-outlined text-[24px] text-slate-400 group-hover:text-indigo-500 transition-colors">{item.icon}</span>
                                <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
