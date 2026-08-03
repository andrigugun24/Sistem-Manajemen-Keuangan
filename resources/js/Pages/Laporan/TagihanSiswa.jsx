import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function LaporanTagihanSiswa() {
    const { tagihans = {}, kategoriTagihans = [], stats = {}, filters = {} } = usePage().props;

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [kategoriId, setKategoriId] = useState(filters.kategori_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = () => {
        router.get(route('laporan.tagihan'), {
            start_date: startDate,
            end_date: endDate,
            kategori_id: kategoriId,
            status: status
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const laporanData = (tagihans.data || []).map((t) => {
        let statusBadge = '';
        if (t.status === 'lunas') statusBadge = 'Lunas';
        else if (t.status === 'sebagian') statusBadge = 'Sebagian';
        else statusBadge = 'Belum Lunas';

        return {
            id: t.id,
            siswa: t.siswa?.nama_lengkap || 'Siswa Dihapus',
            nisn: t.siswa?.nisn || '-',
            kelas: t.siswa?.kelas?.nama_kelas || '-',
            kategori: t.kategori_tagihan?.nama_kategori || '-',
            jatuh_tempo: t.jatuh_tempo ? new Date(t.jatuh_tempo).toLocaleDateString('id-ID') : '-',
            nominal: t.nominal_tagihan || 0,
            sisa: t.sisa_tagihan || 0,
            terbayar: (t.nominal_tagihan || 0) - (t.sisa_tagihan || 0),
            statusStr: statusBadge,
            statusRaw: t.status
        };
    });

    return (
        <>
            <Head>
                <title>Laporan Tagihan Siswa</title>
            </Head>
            <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Laporan Tagihan Siswa</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                            Laporan status pembayaran dan piutang sekolah.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-1.5 shadow-sm">
                            <select
                                value={kategoriId} onChange={e => setKategoriId(e.target.value)}
                                className="px-3 py-1.5 bg-slate-50 text-slate-700 border-none rounded-lg text-sm w-[150px] focus:ring-0 cursor-pointer text-ellipsis"
                            >
                                <option value="all">Semua Kategori</option>
                                {kategoriTagihans.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                ))}
                            </select>

                            <select
                                value={status} onChange={e => setStatus(e.target.value)}
                                className="px-3 py-1.5 bg-slate-50 text-slate-700 border-none rounded-lg text-sm w-[130px] focus:ring-0 cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                <option value="lunas">Sudah Lunas</option>
                                <option value="belum_lunas">Belum Lunas</option>
                                <option value="sebagian">Sebagian</option>
                            </select>

                            <div className="h-6 w-px bg-slate-200 mx-1"></div>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-3 py-1.5 bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 focus:ring-0 w-[130px] cursor-pointer"
                            />
                            <span className="text-slate-400 text-sm">s/d</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-1.5 bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 focus:ring-0 w-[130px] cursor-pointer"
                            />
                            <button onClick={handleFilter} className="p-2 bg-indigo-50 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/40 transition-colors ml-1">
                                <span className="material-symbols-outlined text-[18px]">search</span>
                            </button>
                        </div>
                        <a
                            href={`${route('laporan.tagihan.pdf')}?start_date=${startDate}&end_date=${endDate}&kategori_id=${kategoriId}&status=${status}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-600/20 h-[46px]"
                        >
                            <span className="material-symbols-outlined text-[20px]">print</span>
                            <span>Cetak PDF</span>
                        </a>
                    </div>
                </div>

                {/* Ledger Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <span className="material-symbols-outlined absolute right-0 top-0 text-9xl text-indigo-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all translate-x-4 -translate-y-4">account_balance_wallet</span>
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                            </div>
                            <p className="font-bold text-indigo-700 dark:text-indigo-400">Total Proyeksi Penerimaan</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(stats.totalTagihan || 0)}</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <span className="material-symbols-outlined absolute right-0 top-0 text-9xl text-emerald-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all -rotate-12 translate-x-4 -translate-y-4">check_circle</span>
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-[24px]">payments</span>
                            </div>
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">Total Terkumpul / Lunas</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(stats.totalTerkumpul || 0)}</p>
                        </div>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200/60 dark:border-rose-800/50 p-6 flex flex-col relative overflow-hidden group shadow-sm">
                        <span className="material-symbols-outlined absolute right-0 top-0 text-9xl text-rose-500 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all rotate-12 translate-x-4 -translate-y-4">warning</span>
                        <div className="flex items-center gap-3 relative z-10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-800/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <span className="material-symbols-outlined text-[24px]">assignment_late</span>
                            </div>
                            <p className="font-bold text-rose-700 dark:text-rose-400">Tunggakan (Piutang Siswa)</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">Rp {formatNumber(stats.totalSisa || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[1200px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-[#151724]/80 border-y border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[50px]">No</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[120px]">Kelas</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-[180px]">Jenis / Kategori</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider w-[140px]">Jatuh Tempo</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider w-[150px]">Nominal (Rp)</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider w-[150px]">Sisa (Rp)</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider w-[130px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
                                {laporanData.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">{(tagihans.current_page - 1) * tagihans.per_page + index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{row.siswa}</div>
                                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{row.nisn}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">{row.kelas}</td>
                                        <td className="px-6 py-4 text-sm text-indigo-700 dark:text-indigo-400 font-bold whitespace-nowrap">{row.kategori}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">{row.jatuh_tempo}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                                            Rp {formatNumber(row.nominal)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                                            {row.sisa > 0 ? `Rp ${formatNumber(row.sisa)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${row.statusRaw === 'lunas'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : row.statusRaw === 'belum_lunas'
                                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {row.statusStr}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination omitted for brevity, user can use export to see full */}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
}

LaporanTagihanSiswa.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan', href: '#' }, { label: 'Laporan Tagihan Siswa' }]}>
        {page}
    </AuthenticatedLayout>
);
