import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Search, Filter, Plus, FileText, ArrowRight } from 'lucide-react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function KasKeluarIndex() {
    const { transaksis = { data: [] }, stats = {}, filters = {} } = usePage().props;
    const riwayat = transaksis.data || [];

    return (
        <>
            <Head title="Kas Keluar (Pengeluaran)" />

            <div className="space-y-6 pb-12">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <ArrowUpRight className="w-6 h-6 text-red-500 bg-red-100 p-1 rounded-lg" />
                            Kas Keluar (Pengeluaran)
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola pencatatan pengeluaran dan belanja sekolah</p>
                    </div>
                    <Link href={route('kas.keluar.create')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        Catat Pengeluaran
                    </Link>
                </div>

                {/* Ringkasan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ArrowUpRight className="w-24 h-24 text-red-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Belanja (Bulan Ini)</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{formatRp(stats.totalBulanIni)}</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 inline-flex px-2.5 py-1 rounded-lg border border-red-100">
                            <span>{stats.jumlahTransaksi || 0} transaksi tercatat</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Info</p>
                                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{riwayat.length} Transaksi</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">Pengeluaran manual operasional</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Periode</p>
                                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">Filter berdasarkan bulan aktif</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4 bg-slate-50/50">
                        <div className="flex-1 relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Cari keterangan..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">TANGGAL</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">KATEGORI</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">KETERANGAN</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">NOMINAL</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-center">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {riwayat.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{row.tanggal_transaksi ? new Date(row.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-red-50 text-red-700 border-red-200">
                                                {row.kategori_keuangan?.nama_kategori || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate" title={row.keterangan}>{row.keterangan || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-red-600 bg-red-50 inline-block px-3 py-1.5 rounded-lg border border-red-100">
                                                - {formatRp(row.nominal)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {riwayat.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada transaksi pengeluaran bulan ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30">
                        <div>Menampilkan {riwayat.length} transaksi</div>
                    </div>
                </div>
            </div>
        </>
    );
}

KasKeluarIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Kas Sekolah', href: '#' }, { label: 'Kas Keluar' }]}>
        {page}
    </AuthenticatedLayout>
);
