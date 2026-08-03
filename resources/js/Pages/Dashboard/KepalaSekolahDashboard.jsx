import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, Users, Wallet, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function KepalaSekolahDashboard() {
    const { stats = {}, auth, monthlyData = [], bosData = {}, kapasitasData = [] } = usePage().props;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const userName = auth?.user?.name || 'Kepala Sekolah';

    return (
        <AuthenticatedLayout

            breadcrumbs={[{ label: 'Dashboard' }]}
        >
            <Head title="Dashboard Kepala Sekolah" />

            <div className="space-y-6 pb-12">
                {/* Header Section */}
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Selamat Pagi, {userName}</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{today}</p>
                </div>

                {/* Stat Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[13px] font-medium mb-1">Total Siswa</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalSiswa || 0}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-[14px] bg-indigo-50/80 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-emerald-500 font-semibold">~ +12</span>
                            <span className="text-slate-400 dark:text-slate-500">dari bulan lalu</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[13px] font-medium mb-1">Total Guru & Staf</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalGuru || 0}</h3>
                            </div>
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                {/* Mimic circular progress indicator from image */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-emerald-500" strokeWidth="3" strokeDasharray="100, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">100%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-emerald-500 font-semibold">Lengkap</span>
                            <span className="text-slate-400 dark:text-slate-500">sesuai formasi</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[13px] font-medium mb-1">Saldo Kas Sekolah</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatRp(stats.saldoKas)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-[14px] bg-blue-50 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-emerald-500 font-semibold">~ +5.4%</span>
                            <span className="text-slate-400 dark:text-slate-500">dari bulan lalu</span>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[13px] font-medium mb-1">Pemasukan Bulan Ini</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatRp(stats.totalPemasukan)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-[14px] bg-amber-50 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-emerald-500 font-semibold">~ +8%</span>
                            <span className="text-slate-400 dark:text-slate-500">Sesuai rencana</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Chart & Gauge */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart (takes up 2 columns) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Pemasukan vs Pengeluaran</h3>
                                <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">Tahun Ini</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#5340f1]"></div>
                                    <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Masuk</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]"></div>
                                    <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Keluar</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={4} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                                    <XAxis
                                        dataKey="bulan"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'transparent' }} // Hide Y axis text as per design reference
                                        width={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val) => [`Rp ${val} Jt`]}
                                    />
                                    <Bar dataKey="masuk" fill="#5340f1" radius={[4, 4, 4, 4]} barSize={14} />
                                    <Bar dataKey="keluar" fill="#e2e8f0" radius={[4, 4, 4, 4]} barSize={14} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gauge Chart UI representing 'Kesehatan Keuangan' applied to SPP & Cashflow */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                        <div>
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Kesehatan Keuangan</h3>
                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">Indikator stabilitas sekolah</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center relative mt-6 mb-2">
                            {/* Pure CSS Pseudo Gauge UI */}
                            <div className="w-52 h-28 overflow-hidden relative">
                                <div className="w-52 h-52 rounded-full border-[24px] border-slate-100 dark:border-slate-800 border-t-emerald-400 border-r-emerald-500 border-b-transparent border-l-transparent transform -rotate-45 relative">
                                </div>
                                {/* Needle */}
                                <div className="absolute bottom-[-4px] left-1/2 w-4 h-4 bg-slate-800 rounded-full transform -translate-x-1/2"></div>
                                <div className="absolute bottom-1 left-1/2 w-1.5 h-20 bg-slate-800 rounded-full transform -translate-x-1/2 origin-bottom rotate-[45deg] shadow-sm"></div>
                            </div>

                            <div className="absolute bottom-5 flex flex-col items-center bg-white dark:bg-slate-900 w-24 left-1/2 -translate-x-1/2">
                                <div className="flex items-baseline gap-[2px]">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{Math.round(stats.kepatuhanSPP || 0)}</span>
                                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/100</span>
                                </div>
                                <span className={`${(stats.kepatuhanSPP || 0) >= 75 ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50' : ((stats.kepatuhanSPP || 0) >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200')} text-[10px] font-bold px-3 py-1 rounded-full mt-1 border`}>
                                    {(stats.kepatuhanSPP || 0) >= 75 ? 'Sehat' : ((stats.kepatuhanSPP || 0) >= 50 ? 'Cukup' : 'Perlu Perhatian')}
                                </span>
                            </div>
                        </div>

                        <div className="flex border-t border-slate-100 dark:border-slate-800 pt-5 mt-4">
                            <div className="flex-1 text-center border-r border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-1">Arus Kas</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">Positif</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-1">Rasio SPP</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">Tinggi ({stats.kepatuhanSPP || 0}%)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Retained Content redesigned to match clean aesthetic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dana BOS */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex justify-center items-center text-indigo-600 dark:text-indigo-400">
                                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                                </span>
                                Realisasi Dana BOS
                            </h3>
                            <Link href={route('laporan.keuangan')} className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700">Lihat Laporan</Link>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs text-center border border-slate-100 dark:border-slate-800">IN</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Total Diterima</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Dana Masuk BOS (Tahunan)</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatRp(bosData?.totalDiterima || 0)}</span>
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center font-bold text-orange-500 text-xs text-center border border-orange-100">-</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Terpakai</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Dana Keluar BOS (Tahunan)</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatRp(bosData?.terpakai || 0)}</span>
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-emerald-500 text-xs border border-emerald-100">=</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Sisa Anggaran</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Saldo Akhir BOS</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">{formatRp(bosData?.sisa || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Distribusi Kelas */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Distribusi Kapasitas Kelas</h3>
                        </div>
                        <div className="space-y-[18px]">
                            {kapasitasData && kapasitasData.length > 0 ? (
                                kapasitasData.map((kelas, i) => {
                                    const maxCapacity = Math.max(...kapasitasData.map(k => k.jumlah), 40);
                                    const percent = Math.min((kelas.jumlah / maxCapacity) * 100, 100);
                                    return (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 w-20 truncate" title={kelas.nama}>{kelas.nama}</span>
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-[6px] overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 w-12 text-right">{kelas.jumlah} org</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">Belum ada data siswa.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
