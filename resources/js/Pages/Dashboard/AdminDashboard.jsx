import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const { stats = {}, recentActivities = [], auth, tahunAjaran } = usePage().props;

    const adminInfo = {
        nama: auth?.user?.name || 'Admin',
        role: auth?.user?.role || 'Administrator',
        foto: null,
    };

    const quickActions = [
        { label: 'Tambah Siswa', icon: 'person_add', href: route('siswa.create'), color: 'from-indigo-500 to-blue-500 shadow-indigo-200' },
        { label: 'Kelola Pengguna', icon: 'manage_accounts', href: route('pengguna.index'), color: 'from-purple-500 to-pink-500 shadow-purple-200' },
        { label: 'Pengaturan Sekolah', icon: 'settings', href: route('profil-sekolah.index'), color: 'bg-slate-800 shadow-slate-300' },
    ];

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard Admin Utama' }]}>
            <Head>
                <title>Dashboard Admin</title>
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="space-y-6 pb-12 font-display antialiased max-w-[1400px]">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang, {adminInfo.nama}</h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{today}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                            Tahun Ajaran {tahunAjaran || 'Tidak Diketahui'}
                        </span>
                    </div>
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Siswa</span>
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[18px]">groups</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalSiswa || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Siswa Aktif Terdaftar</p>
                    </div>


                    {/* Card 3 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Kelas</span>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">meeting_room</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalKelas || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Ruang Kelas Terpakai</p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Pengguna Sistem</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">manage_accounts</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalPengguna || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Akun Terdaftar Aktif</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Quick Actions */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                        <div className="mb-5">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Akses Cepat</h3>
                            <p className="text-[13px] text-slate-400 mt-0.5">Pintasan menu utama</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {quickActions.map((action, index) => (
                                <Link 
                                    key={index} 
                                    href={action.href} 
                                    className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                        <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                                    </div>
                                    <span className="ml-4 font-semibold text-[14px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {action.label}
                                    </span>
                                    <span className="material-symbols-outlined ml-auto text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities Feed */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg">history</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aktivitas Terbaru</h3>
                            </div>
                            <Link href={route('log.index')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500 flex items-center gap-1">
                                Lihat Semua
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-blue-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                <span className="material-symbols-outlined text-[18px]">notifications</span>
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{activity.user?.name || 'Sistem'}</div>
                                                    <time className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">{activity.waktu}</time>
                                                </div>
                                                <div className="text-slate-600 dark:text-slate-300 text-sm">{activity.deskripsi}</div>
                                                {activity.ip_address && (
                                                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">public</span> {activity.ip_address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4 block">history</span>
                                        <p className="text-slate-500 dark:text-slate-400">Belum ada aktivitas tercatat hari ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
