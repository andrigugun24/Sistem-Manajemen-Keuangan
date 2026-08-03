import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function TabunganTarik() {
    const { tarikHariIni = [], stats = {} } = usePage().props;
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

    const saldoCukup = selectedSiswa ? Number(nominal || 0) <= (selectedSiswa.saldo || 0) : true;

    const handleSubmit = () => {
        if (!selectedSiswa || !nominal || !saldoCukup || processing) return;
        setProcessing(true);
        router.post(route('tabungan.tarik.store'), {
            siswa_id: selectedSiswa.id,
            nominal: parseInt(nominal),
            tanggal_mutasi: tanggal,
        }, {
            onSuccess: () => { setSelectedSiswa(null); setNominal(''); setSearchSiswa(''); },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Tabungan', href: '/tabungan' }, { label: 'Penarikan' }]}>
            <Head><title>Penarikan Tabungan</title></Head>

            <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full pb-10">
                {/* Left Panel: Form Penarikan */}
                <section className="flex flex-col lg:w-[45%]">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-xl z-10"></div>

                        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 pl-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Catat Penarikan</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Proses permintaan dana tabungan siswa</p>
                        </div>

                        <div className="p-6 pl-8 flex-1 flex flex-col gap-6 relative">
                            {/* Search Siswa */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cari Siswa</label>
                                <input
                                    type="text"
                                    value={searchSiswa}
                                    onChange={(e) => setSearchSiswa(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-slate-800 dark:text-white"
                                    placeholder="Masukkan NISN atau Nama..."
                                />
                                {siswaResults.length > 0 && (
                                    <div className="absolute z-20 w-[calc(100%-4rem)] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {siswaResults.map(siswa => (
                                            <button
                                                key={siswa.id}
                                                onClick={() => { setSelectedSiswa(siswa); setSearchSiswa(''); setSiswaResults([]); }}
                                                className="w-full text-left px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                    {siswa.nama?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{siswa.nama}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">NISN: {siswa.nisn} • Kelas {siswa.kelas} • Saldo: {formatRp(siswa.saldo)}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Student */}
                            {selectedSiswa ? (
                                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedSiswa.nama}</h4>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelas {selectedSiswa.kelas} • NISN: {selectedSiswa.nisn}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end pt-3 border-t border-orange-200 dark:border-orange-500/20">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Saldo Saat Ini</span>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatRp(selectedSiswa.saldo)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 min-h-[160px]">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Belum ada siswa terpilih</p>
                                    <p className="text-xs text-slate-400 mt-1">Gunakan kotak di atas untuk mencari data murid.</p>
                                </div>
                            )}

                            {/* Nominal */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nominal Penarikan</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold text-lg">Rp</span>
                                    <input
                                        type="number"
                                        value={nominal}
                                        onChange={(e) => setNominal(e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 rounded-lg font-bold text-2xl outline-none transition-all ${!saldoCukup
                                            ? 'bg-red-50 dark:bg-red-900/10 border-red-300 text-red-900 dark:text-red-400'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500'
                                            }`}
                                        placeholder="0"
                                    />
                                </div>
                                {!saldoCukup && (
                                    <p className="text-red-500 text-sm font-medium mt-1">
                                        Saldo tidak mencukupi! Maksimal: {formatRp(selectedSiswa?.saldo)}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal</label>
                                <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white" />
                            </div>
                        </div>

                        <div className="p-6 pl-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 mt-auto rounded-b-xl">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedSiswa || !nominal || !saldoCukup || processing}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all"
                            >
                                {processing ? 'Memproses...' : 'Proses Penarikan Dana'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Riwayat */}
                <section className="flex flex-col lg:w-[55%] gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
                        <div className="z-10 relative">
                            <p className="text-slate-400 font-medium text-sm mb-1">Ringkasan Penarikan Hari Ini</p>
                            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mt-2">
                                <div>
                                    <h3 className="text-4xl font-bold text-orange-400 tracking-tight">{formatRp(stats.totalTarikHariIni)}</h3>
                                    <p className="text-sm text-slate-400 mt-1 font-medium">Total Dana Keluar</p>
                                </div>
                                <div className="h-10 w-px bg-slate-700 hidden sm:block mb-1"></div>
                                <div className="mb-0.5">
                                    <span className="text-3xl font-bold text-white">{stats.jumlahTransaksi || 0}</span>
                                    <span className="text-sm text-slate-400 ml-1.5">Transaksi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Riwayat Penarikan Hari Ini</h3>
                        </div>
                        <div className="overflow-x-auto flex-1 max-h-[440px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                        <th className="py-4 px-6">Waktu</th>
                                        <th className="py-4 px-6">Siswa</th>
                                        <th className="py-4 px-6 text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {tarikHariIni.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{tx.tanggal_mutasi ? new Date(tx.tanggal_mutasi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-900 dark:text-white">{tx.tabungan?.siswa?.nama_lengkap || '-'}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelas {tx.tabungan?.siswa?.kelas?.nama_kelas || '-'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-red-600 dark:text-red-400">
                                                -{formatRp(tx.nominal)}
                                            </td>
                                        </tr>
                                    ))}
                                    {tarikHariIni.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-12 px-6 text-center text-slate-400">Belum ada penarikan hari ini</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
