import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function VerifikasiIndex() {
    const pendingPayments = [
        { id: 1, siswa: 'Siti Nurhaliza', nisn: '2024002', kelas: '5B', jenis: 'SPP Februari 2026', nominal: 350000, metode: 'Transfer BCA', tanggal: '21 Feb 2026', waktu: '09:30' },
        { id: 2, siswa: 'Dewi Lestari', nisn: '2024004', kelas: '6B', jenis: 'Kegiatan OSIS', nominal: 150000, metode: 'Transfer Mandiri', tanggal: '21 Feb 2026', waktu: '10:15' },
        { id: 3, siswa: 'Budi Santoso', nisn: '2024005', kelas: '4A', jenis: 'Uang Buku', nominal: 250000, metode: 'Transfer BNI', tanggal: '21 Feb 2026', waktu: '11:45' },
    ];

    return (
        <>
            <Head>
                <title>Verifikasi Pembayaran</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="space-y-6 max-w-7xl mx-auto pb-10">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verifikasi Pembayaran</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Validasi bukti pembayaran dari transfer bank atau setoran mandiri siswa</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Menunggu */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Menunggu Verifikasi</p>
                            <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-500">12</h3>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                            <span className="material-symbols-outlined text-amber-500 text-[28px]">pending_actions</span>
                        </div>
                    </div>

                    {/* Card 2: Disetujui */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Disetujui Bulan Ini</p>
                            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">158</h3>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                            <span className="material-symbols-outlined text-emerald-500 text-[28px] font-medium">verified</span>
                        </div>
                    </div>

                    {/* Card 3: Ditolak */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ditolak / Invalid</p>
                            <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-500">4</h3>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                            <span className="material-symbols-outlined text-rose-500 text-[28px] font-medium">cancel</span>
                        </div>
                    </div>
                </div>

                {/* Filter / Sort area placeholder */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">list_alt</span>
                        Daftar Antrean Verifikasi
                    </h3>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex inline-flex shadow-sm">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-l-lg border-r border-slate-200 dark:border-slate-700">Terbaru</button>
                        <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-primary hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-r-lg">Terlama</button>
                    </div>
                </div>

                {/* Main List */}
                <div className="space-y-4">
                    {pendingPayments.map(payment => (
                        <div key={payment.id} className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Left Side: Student Info & Payment Detail */}
                                <div className="flex gap-5">
                                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 hidden sm:flex">
                                        <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{payment.siswa}</h4>
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 dark:bg-slate-800 dark:text-slate-400">Kelas {payment.kelas}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">NISN: {payment.nisn} • {payment.tanggal} - {payment.waktu}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 lg:border-none lg:pt-0">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {payment.jenis}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-600 dark:text-slate-400 hidden lg:inline">•</span>
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {payment.metode}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Nominal & Actions */}
                                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0">
                                    <div className="text-left lg:text-right">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Nominal Transfer</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {formatNumber(payment.nominal)}</p>
                                    </div>

                                    <div className="flex items-center gap-2 lg:border-l lg:border-slate-200 dark:border-slate-700 lg:dark:border-slate-700 lg:pl-6">
                                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 focus:outline-none" title="Lihat Bukti Transfer">
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:text-white hover:bg-red-500 transition-colors border border-red-100 focus:outline-none" title="Tolak">
                                            <span className="material-symbols-outlined text-[20px]">close</span>
                                        </button>
                                        <button className="h-10 px-4 flex items-center gap-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm focus:outline-none" title="Setujui">
                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                            <span className="text-sm font-medium hidden sm:inline">Setujui</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

VerifikasiIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Keuangan', href: '#' }, { label: 'Verifikasi Pembayaran' }]}>
        {page}
    </AuthenticatedLayout>
);
