import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Trash2, BellOff } from 'lucide-react';

export default function NotifikasiIndex({ notifikasi }) {
    const notifications = notifikasi?.data || [];

    const formatWaktu = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const markAsRead = (id) => {
        router.post(route('notifikasi.read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifikasi.readAll'), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Sistem', href: '#' }, { label: 'Notifikasi' }]}>
            <Head title="Notifikasi" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifikasi</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pemberitahuan terkait aktivitas sistem</p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    >
                        <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read_at ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.read_at ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                    <Bell className={`w-5 h-5 ${!notif.read_at ? 'text-indigo-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-medium ${!notif.read_at ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {notif.data?.title || notif.type || 'Notifikasi'}
                                        </h4>
                                        {!notif.read_at && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {notif.data?.message || notif.data?.desc || JSON.stringify(notif.data || {})}
                                    </p>
                                    <span className="text-xs text-slate-400 mt-2 block">{formatWaktu(notif.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {!notif.read_at && (
                                        <button onClick={() => markAsRead(notif.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Tandai dibaca">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center">
                            <BellOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada notifikasi</p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Notifikasi baru akan muncul di sini</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
