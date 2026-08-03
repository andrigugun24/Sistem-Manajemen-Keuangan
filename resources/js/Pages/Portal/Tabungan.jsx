import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ChickenBankIcon from '@/Components/ChickenBankIcon';
import { formatNumber } from '@/utils/formatRupiah';

export default function Tabungan({ tabungans = [], siswas = [] }) {
    const [selectedSiswaId, setSelectedSiswaId] = useState(
        tabungans.length > 0 ? tabungans[0]?.siswa_id : null
    );

    const selectedTabungan = tabungans.find(t => t.siswa_id === selectedSiswaId);
    const mutasi = selectedTabungan?.mutasi_tabungans || [];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Tabungan Anak' }]}>
            <Head title="Tabungan Anak" />
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-display bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 antialiased">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tabungan Anak</h2>
                        <p className="text-slate-500 mt-1">Saldo dan riwayat mutasi tabungan anak Anda.</p>
                    </div>

                    {siswas.length > 1 && (
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-1.5 inline-flex border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto max-w-full">
                            {siswas.map((siswa) => (
                                <button
                                    key={siswa.id}
                                    onClick={() => setSelectedSiswaId(siswa.id)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${selectedSiswaId === siswa.id
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {siswa.nama_lengkap}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Saldo Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <ChickenBankIcon className="w-6 h-6 text-white/80" />
                            <span className="text-sm font-medium text-white/80">Saldo Tabungan</span>
                        </div>
                        <p className="text-3xl font-extrabold tracking-tight">
                            Rp {formatNumber(selectedTabungan?.saldo || 0)}
                        </p>
                        <p className="text-sm text-white/70 mt-2">
                            {selectedTabungan?.siswa?.nama_lengkap || '-'} • {selectedTabungan?.siswa?.kelas?.nama_kelas || '-'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Total Setoran</span>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            Rp {formatNumber(mutasi.filter(m => m.jenis_mutasi === 'setor').reduce((sum, m) => sum + m.nominal, 0))}
                        </p>
                        <span className="text-xs text-slate-400 mt-1">{mutasi.filter(m => m.jenis_mutasi === 'setor').length} transaksi</span>
                    </div>

                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Total Penarikan</span>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            Rp {formatNumber(mutasi.filter(m => m.jenis_mutasi === 'tarik').reduce((sum, m) => sum + m.nominal, 0))}
                        </p>
                        <span className="text-xs text-slate-400 mt-1">{mutasi.filter(m => m.jenis_mutasi === 'tarik').length} transaksi</span>
                    </div>
                </div>

                {/* Mutasi Table */}
                <div className="bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">swap_vert</span>
                            Riwayat Mutasi Tabungan
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Jenis</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Keterangan</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {mutasi.length > 0 ? mutasi.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {m.tanggal_mutasi ? new Date(m.tanggal_mutasi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${m.jenis_mutasi === 'setor'
                                                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {m.jenis_mutasi === 'setor' ? 'arrow_downward' : 'arrow_upward'}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{m.jenis_mutasi === 'setor' ? 'Setoran' : 'Penarikan'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{m.keterangan || '-'}</td>
                                        <td className={`p-4 text-sm font-bold text-right ${m.jenis_mutasi === 'setor'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {m.jenis_mutasi === 'setor' ? '+' : '-'} Rp {formatNumber(m.nominal)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                                            {selectedTabungan ? 'Belum ada mutasi tabungan.' : 'Data tabungan tidak ditemukan.'}
                                        </td>
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
