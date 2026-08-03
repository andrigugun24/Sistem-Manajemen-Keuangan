import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function KategoriKeuanganIndex({ kategori_keuangans = [] }) {
    const kategoriMasuk = kategori_keuangans.filter(k => k.jenis === 'Pemasukan');
    const kategoriKeluar = kategori_keuangans.filter(k => k.jenis === 'Pengeluaran');

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('kategori-keuangan.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus Kategori Keuangan ini?');
    };

    const KategoriCard = ({ item, type }) => (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-sm transition-all mb-2">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'masuk' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                    {type === 'masuk'
                        ? <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
                        : <ArrowUpCircle className="w-5 h-5 text-red-600" />
                    }
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">{item.nama_kategori}</p>
                    <p className="text-[11px] font-medium text-slate-400 capitalize">{item.jenis}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="success" dot>Aktif</Badge>
                <Link href={route('kategori-keuangan.edit', item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Kategori Keuangan' }]}>
            <Head title="Kategori Keuangan" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Kategori Keuangan</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pengaturan kategori untuk pemasukan dan pengeluaran</p>
                    </div>
                    <Link href={route('kategori-keuangan.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
                        <Plus className="w-4 h-4" /> Tambah Kategori
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/80">
                        <div className="flex items-center gap-2 mb-4">
                            <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold text-slate-800">Kategori Kas Masuk</h3>
                            <Badge variant="success">{kategoriMasuk.length}</Badge>
                        </div>
                        <div className="space-y-2">
                            {kategoriMasuk.length > 0 ? (
                                kategoriMasuk.map(item => <KategoriCard key={item.id} item={item} type="masuk" />)
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Belum ada kategori pemasukan.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/80">
                        <div className="flex items-center gap-2 mb-4">
                            <ArrowUpCircle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-slate-800">Kategori Kas Keluar</h3>
                            <Badge variant="danger">{kategoriKeluar.length}</Badge>
                        </div>
                        <div className="space-y-2">
                            {kategoriKeluar.length > 0 ? (
                                kategoriKeluar.map(item => <KategoriCard key={item.id} item={item} type="keluar" />)
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Belum ada kategori pengeluaran.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
