import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Calendar, ChevronDown, SlidersHorizontal, Download, MoreVertical, Settings, Users, BookOpen, Banknote, Lock, Badge as BadgeIcon, Activity } from 'lucide-react';

export default function LogAktivitasIndex({ logs }) {
    const logData = logs?.data || [];

    const getAksiBadgeClass = (action) => {
        const a = (action || '').toLowerCase();
        if (a.includes('create') || a.includes('tambah') || a.includes('buat')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (a.includes('update') || a.includes('ubah') || a.includes('edit')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (a.includes('delete') || a.includes('hapus')) return 'bg-red-100 text-red-800 border-red-200';
        if (a.includes('login') || a.includes('logout') || a.includes('auth')) return 'bg-slate-100 text-slate-700 border-slate-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="flex flex-1 flex-col font-display pb-10">
            <Head title="Log Aktivitas Sistem" />

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Log Aktivitas Sistem</h1>
                    <p className="text-base text-slate-500 dark:text-slate-400">Pantau semua aktivitas pengguna dan perubahan data dalam sistem.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors">
                        <SlidersHorizontal className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        Konfigurasi Log
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors">
                        <Download className="w-5 h-5" />
                        Export Log
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Waktu</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pengguna</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aksi</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Modul</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Detail</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white dark:bg-slate-900">
                            {logData.length > 0 ? logData.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium font-mono text-slate-600 dark:text-slate-400">
                                        {formatDate(log.created_at)}<br />
                                        <span className="text-xs text-slate-400">{formatTime(log.created_at)}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">{(log.user?.name || '?')[0]}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{log.user?.name || 'System'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${getAksiBadgeClass(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-[18px] h-[18px] text-slate-400" />
                                            {log.model_type ? log.model_type.split('\\').pop() : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="truncate max-w-xs">{log.action} {log.model_type ? log.model_type.split('\\').pop() : ''} {log.model_id ? `#${log.model_id}` : ''}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">
                                        {log.ip_address || '-'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada log aktivitas</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Aktivitas sistem akan tercatat secara otomatis</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs && logs.links && (
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Menampilkan <span className="font-bold text-slate-900 dark:text-white">{logs.from || 0}</span> sampai <span className="font-bold text-slate-900 dark:text-white">{logs.to || 0}</span> dari <span className="font-bold text-slate-900 dark:text-white">{logs.total || 0}</span> hasil
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {logs.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active
                                                    ? 'z-10 bg-primary text-white focus:z-20'
                                                    : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                } ${i === 0 ? 'rounded-l-md' : ''} ${i === logs.links.length - 1 ? 'rounded-r-md' : ''} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

LogAktivitasIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Pengaturan', href: '#' }, { label: 'Log Aktivitas' }]}>
        {page}
    </AuthenticatedLayout>
);
