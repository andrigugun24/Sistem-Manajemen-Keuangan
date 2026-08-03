import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Tag, CalendarDays, Receipt, AlertCircle } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function KategoriTagihanIndex({ kategori_tagihans = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('kategori-tagihan.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus Kategori Tagihan ini? (Tagihan terkait dapat terpengaruh)');
    };

    const filteredData = kategori_tagihans.filter((kt) =>
        kt.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (kt.kode_tagihan && kt.kode_tagihan.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const KategoriCard = ({ item }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all gap-4">
            <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.jenis_tagihan === 'Bulanan' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                    {item.jenis_tagihan === 'Bulanan' ? <CalendarDays className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-800">{item.nama_kategori}</h3>
                        <Badge variant={item.jenis_tagihan === 'Bulanan' ? 'info' : 'warning'} className="text-[10px] px-1.5 py-0 h-4 min-h-0 bg-opacity-10 border-0">
                            {item.jenis_tagihan}
                        </Badge>
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">{item.kode_tagihan || '-'} • Default: {formatRp(item.nominal_default || 0)}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.deskripsi || 'Tidak ada deskripsi'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 sm:justify-end shrink-0">
                <Badge variant="success" dot>Aktif</Badge>
                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                    <Link href={route('kategori-tagihan.edit', item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Edit">
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Kategori Tagihan' }]}>
            <Head title="Kategori Tagihan" />

            <div className="space-y-6 max-w-5xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kategori Tagihan</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola jenis-jenis tagihan yang berlaku untuk siswa (SPP, DSP, dll)</p>
                    </div>
                    <Link href={route('kategori-tagihan.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> Tambah Kategori
                    </Link>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Tagihan Bulanan</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Jenis tagihan yang ditarik setiap bulan (12 kali dalam setahun). Anda bisa generate langsung untuk 1 tahun penuh saat awal tahun ajaran.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center shrink-0">
                            <Receipt className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Tagihan Sekali Bayar</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Jenis tagihan insidental atau yang dibayarkan satu kali saja (misal: Uang Pangkal, Seragam, Kegiatan Khusus, dll).
                            </p>
                        </div>
                    </div>
                </div>

                {/* List Content */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Tag className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-9 p-2.5 min-w-[250px] shadow-sm"
                                placeholder="Cari nama atau kode tagihan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Total {filteredData.length} Kategori
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredData.length > 0 ? (
                            filteredData.map(item => <KategoriCard key={item.id} item={item} />)
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center justify-center opacity-60">
                                <AlertCircle className="w-12 h-12 text-slate-400 mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 italic">Belum ada kategori tagihan yang sesuai pencarian.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
