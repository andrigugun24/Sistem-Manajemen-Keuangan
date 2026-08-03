import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Landmark,
    MoreHorizontal,
    ShoppingBag,
    Building2,
    Wrench,
    Filter,
    Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Badge from '@/Components/Badge';
import DataTable from '@/Components/DataTable';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function BendaharaDashboard() {
    const { stats = {}, chartData = [], aktivitasTerbaru = [], tagihanBelumLunas = [] } = usePage().props;

    const tagihanColumns = [
        { header: 'SISWA', accessor: 'siswa', render: (row) => <span className="font-semibold text-slate-800 dark:text-white">{row.siswa}</span> },
        { header: 'KELAS', accessor: 'kelas' },
        { header: 'JENIS TAGIHAN', accessor: 'jenis', render: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.jenis}</span> },
        { header: 'NOMINAL', accessor: 'nominal', render: (row) => <span className="font-bold text-slate-800 dark:text-white">{formatRp(row.nominal)}</span> },
        { header: 'JATUH TEMPO', accessor: 'jatuhTempo' },
        {
            header: 'STATUS', accessor: 'status', render: (row) => {
                const variants = { 'belum_lunas': 'warning', 'sebagian': 'info', 'terlambat': 'danger' };
                const labels = { 'belum_lunas': 'Belum Lunas', 'sebagian': 'Sebagian', 'terlambat': 'Terlambat' };
                return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
            }
        },
    ];

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const userName = usePage().props.auth?.user?.name || 'Bendahara';

    return (
        <>
            <Head title="Dashboard Bendahara" />

            <div className="space-y-6 pb-12 max-w-[1400px]">
                {/* Header Section */}
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang, {userName}</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{today}</p>
                </div>

                {/* Stat Cards - Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Kas Masuk */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                                <ArrowDownLeft className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-semibold">
                                +12% <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Kas Masuk</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Rp</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{formatNumber((stats.totalKasMasuk || 0))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Kas Keluar */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                                <ArrowUpRight className="w-6 h-6 text-rose-500" />
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-semibold">
                                -5% <ArrowDownLeft className="w-3 h-3" />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Kas Keluar</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Rp</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{formatNumber((stats.totalKasKeluar || 0))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Saldo Kas (Highlighted) */}
                    <div className="bg-gradient-to-br from-[#5340f1] to-[#3a2db3] rounded-[24px] p-6 shadow-lg shadow-indigo-500/20 flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-slate-900 opacity-5 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white dark:bg-slate-900 opacity-5 rounded-full -ml-10 -mb-10"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                                +8% <ArrowUpRight className="w-3 h-3 shrink-0" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-indigo-100 text-sm font-medium mb-1">Saldo Kas Saat Ini</p>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-xl font-bold">Rp</span>
                                <span className="text-4xl font-extrabold tracking-tight">{formatNumber((stats.saldoKas || 0))}</span>
                            </div>
                            <p className="text-indigo-200 text-xs">Updated: Just now</p>
                        </div>
                    </div>

                    {/* Card 4: Tabungan */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <Landmark className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-semibold">
                                +3% <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Tabungan Siswa</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Rp</span>
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{formatNumber((stats.totalTabungan || 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Arus Kas Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Arus Kas Bulanan</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pemasukan vs Pengeluaran (Jan - Des)</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-slate-600 dark:text-slate-400">Masuk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <span className="text-slate-600 dark:text-slate-400">Keluar</span>
                                </div>
                                <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 ml-2"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="flex-1 mt-4 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(val) => `${val}jt`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val) => [`Rp ${val} Juta`]}
                                    />
                                    <Area type="monotone" dataKey="masuk" stroke="#10b981" strokeWidth={3} fill="none" dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                                    <Area type="monotone" dataKey="keluar" stroke="#ef4444" strokeWidth={3} fill="none" dot={false} activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Aktivitas Terbaru */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Aktivitas Terbaru</h3>

                        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            {aktivitasTerbaru.length > 0 ? aktivitasTerbaru.map((item, idx) => (
                                <div key={item.id} className="flex gap-4 relative">
                                    {idx < aktivitasTerbaru.length - 1 && (
                                        <div className="absolute top-10 left-[19px] w-px h-[calc(100%+8px)] bg-slate-200"></div>
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white relative z-10 ${item.tipe === 'masuk' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                        {item.tipe === 'masuk'
                                            ? <Wallet className="w-4 h-4 text-emerald-600" />
                                            : <ShoppingBag className="w-4 h-4 text-rose-600" />
                                        }
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{item.kategori}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.keterangan} • {formatRp(item.nominal)}</p>
                                        <span className="text-[11px] font-medium text-slate-400 mt-1 block">{item.waktu}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-slate-400 py-8">
                                    <p className="text-sm">Belum ada aktivitas</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 mt-2">
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 w-full text-center py-2 transition-colors">
                                Lihat Semua Aktivitas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tagihan Belum Lunas</h3>
                            <p className="text-sm text-slate-500 mt-1">Daftar siswa dengan tunggakan pembayaran</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#5340f1] hover:bg-[#4636cb] text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-500/20 transition-all">
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </div>
                    </div>

                    <DataTable
                        columns={tagihanColumns}
                        data={tagihanBelumLunas}
                        hideSearch
                    />
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </>
    );
}

BendaharaDashboard.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard Bendahara' }]}>
        {page}
    </AuthenticatedLayout>
);
