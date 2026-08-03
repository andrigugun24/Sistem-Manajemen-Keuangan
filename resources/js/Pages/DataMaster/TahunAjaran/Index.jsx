import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function TahunAjaranIndex({ tahun_ajarans = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('tahun-ajaran.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus Tahun Ajaran ini?');
    };

    const filteredData = tahun_ajarans.filter((item) =>
        item.nama_tahun_ajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.semester.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12 font-display antialiased">
            <Head title="Tahun Ajaran" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Data Tahun Ajaran</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Kelola informasi periode akademik, tahun ajaran, dan semester aktif.</p>
                </div>
                <Link href={route('tahun-ajaran.create')} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-sm shadow-blue-600/20 active:scale-95 text-sm">
                    <Plus className="w-4 h-4" /> Tambah Tahun Ajaran
                </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col mt-4">
                {/* Controls */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
                    <div className="relative w-full sm:w-[380px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari tahun ajaran atau semester..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-transparent rounded-full text-[13.5px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:bg-slate-900 focus:border-blue-500/30 text-slate-900 dark:text-white transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">No</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tahun Ajaran</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900">
                            {filteredData.length > 0 ? filteredData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 text-[13px] font-medium text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white text-[14px]">{item.nama_tahun_ajaran}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{item.semester}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {item.aktif ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600 dark:text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                Nonaktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <Link href={route('tahun-ajaran.edit', item.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">Belum ada data tahun ajaran.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

TahunAjaranIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Master' }, { label: 'Tahun Ajaran' }]}>
        {page}
    </AuthenticatedLayout>
);
