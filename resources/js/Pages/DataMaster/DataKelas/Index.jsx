import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, MoreVertical, Users, Pencil, Trash2, Filter, ChevronDown, GraduationCap } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function DataKelasIndex({ kelas = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('kelas.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus Kelas ini?');
    };

    const filteredData = kelas.filter((k) =>
        k.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.instansi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getColorClasses = (instansi) => {
        switch (instansi) {
            case 'SMA': return { bg: 'bg-emerald-500', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-600' };
            case 'SMP': return { bg: 'bg-blue-500', badgeBg: 'bg-blue-50', badgeText: 'text-blue-600' };
            default: return { bg: 'bg-slate-50 dark:bg-slate-800/500', badgeBg: 'bg-slate-50 dark:bg-slate-800/50', badgeText: 'text-slate-600 dark:text-slate-400' };
        }
    };

    return (
        <div className="space-y-6 pb-12 font-display antialiased">
            <Head title="Data Kelas" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Master Data Kelas</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola data kelas, instansi, dan informasi detail lainnya.</p>
                </div>
                <Link href={route('kelas.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Tambah Kelas
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-1.5 shadow-sm flex-1 w-full flex items-center">
                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Cari nama kelas atau instansi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-none w-full bg-transparent focus:ring-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 py-1.5"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 px-4 py-2.5 shadow-sm flex items-center justify-between gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[140px] hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                        Semua Tingkat
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-2.5 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredData.length > 0 ? filteredData.map((kelas) => {
                    const colors = getColorClasses(kelas.instansi);
                    return (
                        <div key={kelas.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Top Color Line */}
                            <div className={`h-1 w-full ${colors.bg}`}></div>

                            <div className="p-5">
                                {/* Badge and Menu */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                                        Instansi {kelas.instansi}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{kelas.nama_kelas}</h3>

                                {/* Info */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kode / Instansi</p>
                                        <p className="text-sm font-semibold text-slate-800">{kelas.instansi}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Siswa</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{kelas.siswas_count || 0} Siswa</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex border-t border-slate-100 dark:border-slate-800">
                                <Link href={route('kelas.edit', kelas.id)} className="flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors border-r border-slate-100 dark:border-slate-800">
                                    <Pencil className="w-4 h-4 text-slate-400" />
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(kelas.id)} className="flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4 text-slate-400" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Tidak Ada Data Kelas</h3>
                        <p className="text-slate-500 dark:text-slate-400">Belum ada kelas yang ditambahkan atau tidak ada kelas yang cocok dengan pencarian Anda.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls Here when needed */}
        </div>
    );
}

DataKelasIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Data Kelas' }]}>
        {page}
    </AuthenticatedLayout>
);
