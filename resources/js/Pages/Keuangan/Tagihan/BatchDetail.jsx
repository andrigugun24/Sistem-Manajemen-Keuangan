import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { formatRp } from '@/utils/formatRupiah';

export default function BatchDetail() {
    const { tagihans = { data: [], links: [] }, batchInfo } = usePage().props;
    const items = tagihans.data || [];

    const getStatusLabel = (status) => {
        if (status === 'lunas') return 'Lunas';
        if (status === 'sebagian') return 'Sebagian';
        return 'Belum Lunas';
    };

    const getStatusColor = (status) => {
        if (status === 'lunas') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
        if (status === 'sebagian') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    };

    return (
        <>
            <Head title={`Detail Batch - ${batchInfo.kategori}`} />

            <div className="space-y-6 pb-12">
                <div className="flex items-center gap-4">
                    <Link href={route('tagihan.index')} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Detail Batch Tagihan</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {batchInfo.kategori} {batchInfo.bulan ? `— ${batchInfo.bulan}` : ''} ({batchInfo.target_kelas === 'semua' ? 'Semua Kelas' : batchInfo.target_kelas === '79' ? 'Kelas 7-9 (SMP)' : batchInfo.target_kelas === '1012' ? 'Kelas 10-12 (SMA)' : 'Custom Siswa'})
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Nama Siswa</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Kelas</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Sisa Tagihan</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {items.length > 0 ? items.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {t.siswa?.nama_lengkap || '-'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {t.siswa?.kelas?.nama_kelas || '-'}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">
                                            {formatRp(t.nominal_tagihan)}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right">
                                            <span className={t.sisa_tagihan > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                                {formatRp(t.sisa_tagihan)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusColor(t.status)}`}>
                                                {getStatusLabel(t.status)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">Tidak ada siswa pada batch ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {tagihans.links && tagihans.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-1 bg-white dark:bg-[#1e1c30]">
                            {tagihans.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${link.active
                                            ? 'bg-primary text-white font-bold'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

BatchDetail.layout = page => <AuthenticatedLayout children={page} />;
