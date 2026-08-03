import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatNumber } from '@/utils/formatRupiah';

export default function Tagihan({ tagihans = {}, pembayarans = [], siswas = [] }) {
    const items = tagihans.data || [];

    const statusColor = (status) => {
        switch (status) {
            case 'lunas': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
            case 'sebagian': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
            default: return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
        }
    };

    const statusLabel = (status) => {
        switch (status) {
            case 'lunas': return 'Lunas';
            case 'sebagian': return 'Sebagian';
            default: return 'Belum Bayar';
        }
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Tagihan & Pembayaran' }]}>
            <Head title="Tagihan & Pembayaran" />
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-display bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 antialiased">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tagihan & Pembayaran</h2>
                        <p className="text-slate-500 mt-1">Daftar tagihan dan riwayat pembayaran anak Anda.</p>
                    </div>
                </div>

                {/* Daftar Tagihan */}
                <div className="bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            Daftar Tagihan
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Siswa</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Jenis Tagihan</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Bulan</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Sisa</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Jatuh Tempo</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {items.length > 0 ? items.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {t.siswa?.nama_lengkap || '-'}
                                            <span className="block text-xs text-slate-400">{t.siswa?.kelas?.nama_kelas || ''}</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                                            {t.kategori_tagihan?.nama_kategori || '-'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{t.bulan_tagihan || '-'}</td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">Rp {formatNumber(t.nominal_tagihan)}</td>
                                        <td className="p-4 text-sm font-bold text-right">
                                            <span className={t.sisa_tagihan > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                                Rp {formatNumber(t.sisa_tagihan)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {t.jatuh_tempo ? new Date(t.jatuh_tempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${statusColor(t.status)}`}>
                                                {statusLabel(t.status)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-500 text-sm">Tidak ada data tagihan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {tagihans.links && tagihans.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-1">
                            {tagihans.links.map((link, index) => (
                                <a
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

                {/* Riwayat Pembayaran */}
                <div className="bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-600">payments</span>
                            Riwayat Pembayaran
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Siswa</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">No. Referensi</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Metode</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {pembayarans.length > 0 ? pembayarans.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {p.tanggal_bayar ? new Date(p.tanggal_bayar).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{p.siswa?.nama_lengkap || '-'}</td>
                                        <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{p.no_referensi}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{p.metode_pembayaran}</td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">Rp {formatNumber(p.total_bayar)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${p.status_pembayaran === 'lunas'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                    : p.status_pembayaran === 'menunggu'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                                                }`}>
                                                {p.status_pembayaran === 'lunas' ? 'Lunas' : p.status_pembayaran === 'menunggu' ? 'Menunggu' : 'Ditolak'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">Belum ada riwayat pembayaran.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
