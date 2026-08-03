import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Filter, Download, Edit, Trash2, Shield, GraduationCap, DollarSign, Users, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function PenggunaIndex() {
    const { users = { data: [] }, roleCounts = {}, filters = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const userList = Array.isArray(users) ? users : (users.data || []);
    const isPaginated = !Array.isArray(users) && users.data;

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('pengguna.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus pengguna ini?');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pengguna.index'), { search: searchTerm }, { preserveState: true });
    };

    const roleColors = {
        'admin': 'bg-blue-100 text-blue-600',
        'kepala_sekolah': 'bg-purple-100/80 text-purple-600',
        'guru': 'bg-emerald-100/80 text-emerald-600',
        'orang_tua': 'bg-slate-100 text-slate-600 dark:text-slate-400',
        'bendahara': 'bg-amber-100/80 text-amber-600',
    };

    // Role counts come from backend (accurate across all pages)

    const filteredUsers = userList.filter((user) => {
        const searchLow = searchTerm.toLowerCase();
        const matchName = user?.name ? String(user.name).toLowerCase().includes(searchLow) : false;
        const matchEmail = user?.email ? String(user.email).toLowerCase().includes(searchLow) : false;
        return matchName || matchEmail;
    });

    const statCards = [
        { label: 'Admin', count: roleCounts.admin || 0, icon: Shield, color: 'blue' },
        { label: 'Kepala Sekolah', count: roleCounts.kepala_sekolah || 0, icon: GraduationCap, color: 'purple' },
        { label: 'Bendahara', count: roleCounts.bendahara || 0, icon: DollarSign, color: 'amber' },
        { label: 'Guru', count: roleCounts.guru || 0, icon: CreditCard, color: 'emerald' },
        { label: 'Orang Tua', count: roleCounts.orang_tua || 0, icon: Users, color: 'slate' },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Manajemen Pengguna & Peran" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Pengguna & Peran</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Kelola akses, peran, dan status pengguna sistem sekolah Yayasan La Tahzan Citeras.</p>
                </div>
                <Link href={route('pengguna.create')} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-sm shadow-blue-600/20 active:scale-95 text-sm">
                    <Plus className="w-4 h-4" />
                    Tambah Pengguna
                </Link>
            </div>

            {/* Stats Cards — Real Counts */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                {statCards.map(({ label, count, icon: Icon, color }) => (
                    <div key={label} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:border-${color}-200 hover:shadow-md transition-all h-[130px] justify-between`}>
                        <div className={`w-10 h-10 rounded-full bg-${color}-50 text-${color}-600 flex flex-shrink-0 items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-none mb-1.5">{label}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                {/* Table Top Controls */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-[380px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-transparent rounded-full text-[13.5px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/30 text-slate-900 dark:text-white transition-all font-medium"
                        />
                    </form>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center justify-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="flex items-center justify-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                            <Download className="w-4 h-4" /> Ekspor
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">No</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pengguna</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peran</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Terakhir Login</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-5 text-[13px] font-medium text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{user?.name || 'Tanpa Nama'}</span>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug">{user?.email || 'Tanpa Email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide capitalize ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                            {user.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Aktif
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                                        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <Link href={route('pengguna.edit', user.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">Belum ada data pengguna.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination — Real */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-b-[20px]">
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                        Menampilkan <span className="font-bold text-slate-700 dark:text-slate-300">{isPaginated ? users.from || 0 : 1}</span> sampai <span className="font-bold text-slate-700 dark:text-slate-300">{isPaginated ? users.to || 0 : userList.length}</span> dari <span className="font-bold text-slate-700 dark:text-slate-300">{isPaginated ? users.total : userList.length}</span> hasil
                    </p>
                    {isPaginated && users.last_page > 1 && (
                        <div className="flex items-center gap-1.5">
                            {users.prev_page_url && (
                                <Link href={users.prev_page_url} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>
                            )}
                            {users.links && users.links.filter(l => !l.label.includes('&')).map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-medium text-[13px] transition-colors ${link.active ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                            {users.next_page_url && (
                                <Link href={users.next_page_url} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

PenggunaIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard', href: '#' }, { label: 'Manajemen Pengguna' }]}>
        {page}
    </AuthenticatedLayout>
);
