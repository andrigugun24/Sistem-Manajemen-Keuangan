import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function TabunganSetor() {
    const { setoranHariIni = [], stats = {} } = usePage().props;
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [nominal, setNominal] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [searchSiswa, setSearchSiswa] = useState('');
    const [siswaResults, setSiswaResults] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (searchSiswa.length < 2) { setSiswaResults([]); return; }
        const timer = setTimeout(() => {
            fetch(route('api.cari-siswa-tabungan') + '?q=' + encodeURIComponent(searchSiswa))
                .then(r => r.json())
                .then(data => setSiswaResults(data))
                .catch(() => setSiswaResults([]));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchSiswa]);

    const quickAmounts = [10000, 20000, 50000, 100000];

    const handleQuickAmount = (amount) => {
        setNominal(amount.toString());
    };

    const handleSubmit = () => {
        if (!selectedSiswa || !nominal || processing) return;
        setProcessing(true);
        router.post(route('tabungan.setor.store'), {
            siswa_id: selectedSiswa.id,
            nominal: parseInt(nominal),
            tanggal_mutasi: tanggal,
        }, {
            onSuccess: () => { setSelectedSiswa(null); setNominal(''); setSearchSiswa(''); },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head>
                <title>Setoran Tabungan</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full pb-10">
                {/* Left Panel: Form Catat Setoran (45%) */}
                <section className="flex flex-col lg:w-[45%]">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full relative group">
                        {/* Accent Border */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-xl z-10"></div>

                        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center pl-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Catat Setoran Baru</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masukkan data transaksi setoran siswa</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                SETORAN
                            </div>
                        </div>

                        <div className="p-6 pl-8 flex-1 flex flex-col gap-6">
                            {/* Student Search */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cari Siswa</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        type="text"
                                        value={searchSiswa}
                                        onChange={(e) => setSearchSiswa(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 dark:text-slate-200"
                                        placeholder="Ketik nama atau NISN..."
                                    />
                                </div>
                                {/* Dropdown List */}
                                {siswaResults.length > 0 && (
                                    <div className="absolute z-20 w-full lg:w-[41%] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {siswaResults.map(siswa => (
                                            <button
                                                key={siswa.id}
                                                onClick={() => { setSelectedSiswa(siswa); setSearchSiswa(''); setSiswaResults([]); }}
                                                className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                    {siswa.nama?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{siswa.nama}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">NISN: {siswa.nisn} • Kelas {siswa.kelas} • Saldo: Rp {formatNumber((siswa.saldo || 0))}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Student Info Card */}
                            {selectedSiswa ? (
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-100 dark:border-emerald-500/30 rounded-xl p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
                                    <div className="absolute -right-6 -bottom-6 text-emerald-200 dark:text-emerald-500/10 opacity-50 pointer-events-none">
                                        <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
                                    </div>
                                    <div className="relative z-10 size-16 rounded-full bg-white dark:bg-slate-800 p-1 shadow-sm shrink-0 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                                            {selectedSiswa.nama?.charAt(0) || '?'}
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedSiswa.nama}</h4>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelas {selectedSiswa.kelas} • NISN: {selectedSiswa.nisn}</p>
                                            </div>
                                            <button onClick={() => setSelectedSiswa(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">Saldo Saat Ini</span>
                                            <span className="text-xl font-bold text-slate-900 dark:text-white">Rp {formatNumber((selectedSiswa.saldo || 0))}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 min-h-[160px]">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="material-symbols-outlined text-slate-400">person_search</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Belum ada siswa terpilih</p>
                                    <p className="text-xs text-slate-400 mt-1">Pilih siswa melalui kolom pencarian di atas untuk memulai setoran.</p>
                                </div>
                            )}

                            {/* Date Picker */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Transaksi</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Nominal Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nominal Setoran</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold text-lg">Rp</span>
                                    <input
                                        type="number"
                                        value={nominal}
                                        onChange={(e) => setNominal(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-2xl text-slate-900 dark:text-white placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>
                                {/* Quick Amount Buttons */}
                                <div className="grid grid-cols-4 gap-2">
                                    {quickAmounts.map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => handleQuickAmount(amount)}
                                            className={`py-2 px-1 rounded-lg border text-sm font-semibold transition-all ${Number(nominal) === amount
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600'
                                                }`}
                                        >
                                            {amount / 1000}rb
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 pl-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 mt-auto rounded-b-xl">
                            <button onClick={handleSubmit} disabled={!selectedSiswa || !nominal || processing} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group/btn">
                                <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">save</span>
                                {processing ? 'Menyimpan...' : 'Simpan Setoran'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Setoran Hari Ini (55%) */}
                <section className="flex flex-col lg:w-[55%] gap-6">
                    {/* Summary Card */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500">
                            <span className="material-symbols-outlined text-[140px] rotate-12">payments</span>
                        </div>
                        <div className="z-10">
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                Total Setoran Hari Ini
                            </p>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Rp {formatNumber((stats.totalSetoranHariIni || 0))}</h2>
                        </div>
                        <div className="flex gap-3 z-10 w-full sm:w-auto">
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex-1 sm:flex-none text-center sm:text-left min-w-[100px]">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transaksi</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{setoranHariIni.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">history</span>
                                Riwayat Transaksi
                            </h3>
                        </div>
                        <div className="overflow-x-auto flex-1 h-[400px] overflow-y-auto w-full styled-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-10">
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waktu</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Siswa</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kelas</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Nominal</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {setoranHariIni.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{tx.tanggal_mutasi ? new Date(tx.tanggal_mutasi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs hidden sm:flex">
                                                        {tx.tabungan?.siswa?.nama_lengkap?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">{tx.tabungan?.siswa?.nama_lengkap || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{tx.tabungan?.siswa?.kelas?.nama_kelas || '-'}</td>
                                            <td className="py-4 px-5 text-right font-bold text-emerald-600 dark:text-emerald-400">+Rp {formatNumber((tx.nominal || 0))}</td>
                                            <td className="py-4 px-5 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {setoranHariIni.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 px-5 text-center text-slate-400">Belum ada setoran hari ini</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            <style jsx global>{`
                .styled-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .styled-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .styled-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .dark .styled-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
            `}</style>
        </>
    );
}

TabunganSetor.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Tabungan', href: '/tabungan' }, { label: 'Setor Tunai' }]}>
        {page}
    </AuthenticatedLayout>
);
