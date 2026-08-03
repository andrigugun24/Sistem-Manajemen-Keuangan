import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import ChickenBankIcon from '@/Components/ChickenBankIcon';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function BukuTabungan() {
    const { tabungan = null, mutasis = { data: [] }, filters = {} } = usePage().props;
    const [searchSiswa, setSearchSiswa] = useState('');
    const [siswaResults, setSiswaResults] = useState([]);

    const siswa = tabungan ? {
        nama: tabungan.siswa?.nama_lengkap || '-',
        nisn: tabungan.siswa?.nisn || '-',
        kelas: tabungan.siswa?.kelas?.nama_kelas || '-',
        saldo: tabungan.saldo || 0,
        totalSetoran: tabungan.total_setoran || 0,
        totalPenarikan: tabungan.total_penarikan || 0,
        jumlahTrx: mutasis.total || (mutasis.data || []).length,
    } : null;

    const mutasi = (mutasis.data || []).map(m => ({
        id: m.id,
        tanggal: m.tanggal_mutasi ? new Date(m.tanggal_mutasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        keterangan: m.jenis_mutasi === 'setor' ? 'Setoran' : 'Penarikan',
        jenis: m.jenis_mutasi,
        nominal: m.nominal,
        saldo: m.saldo_sesudah || 0,
    }));

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

    const handleSelectSiswa = (siswaItem) => {
        setSearchSiswa('');
        setSiswaResults([]);
        router.get(route('tabungan.buku'), { siswa_id: siswaItem.id }, { preserveState: true });
    };

    return (
        <>
            <Head>
                <title>Buku Tabungan Digital</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="space-y-8 max-w-[1280px] mx-auto w-full pb-10">
                {/* Page Header & Student Selector */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Riwayat Tabungan Siswa</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Pantau detail transaksi mutasi dan perkembangan saldo tabungan.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-emerald-500/10 relative">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pilih Siswa</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">search</span>
                            <input
                                type="text"
                                value={searchSiswa}
                                onChange={e => setSearchSiswa(e.target.value)}
                                placeholder="Cari Nama Siswa atau NISN..."
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-base font-medium shadow-sm"
                            />
                        </div>
                        {searchSiswa.length >= 2 && (
                            <div className="absolute left-6 right-6 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-30 max-h-48 overflow-y-auto">
                                {siswaResults.length > 0 ? siswaResults.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleSelectSiswa(s)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center gap-3"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-emerald-700 text-xs font-bold">{s.nama.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-800 dark:text-white">{s.nama}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">NISN: {s.nisn} • Kelas {s.kelas}</p>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="px-4 py-3 text-sm text-slate-400 text-center">Siswa tidak ditemukan</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Summary Card */}
                {siswa ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-t-4 border-t-emerald-500 overflow-hidden">
                        <div className="p-6 lg:p-8">
                            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-8 mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="size-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl font-bold border-2 border-emerald-500/20">
                                        {siswa.nama?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{siswa.nama}</h2>
                                        <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="material-symbols-outlined text-[18px]">badge</span>
                                            <span>NISN: {siswa.nisn}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                                            <span>Kelas {siswa.kelas}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:items-end">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saldo Saat Ini</span>
                                    <div className="text-4xl lg:text-5xl font-extrabold text-emerald-500 mt-1 tracking-tight">Rp {formatNumber(siswa.saldo)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Stat Total Setoran */}
                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <ChickenBankIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Keseluruhan Setoran</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {formatNumber(siswa.totalSetoran)}</p>
                                    </div>
                                </div>
                                {/* Stat Total Penarikan */}
                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Kumulatif Penarikan</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {formatNumber(siswa.totalPenarikan)}</p>
                                    </div>
                                </div>
                                {/* Stat Jumlah Transaksi */}
                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined">receipt_long</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Jumlah Transaksi Rekening</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{siswa.jumlahTrx}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400">Pilih siswa untuk melihat buku tabungan</p>
                    </div>
                )}

                {/* Transaction Table Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
                    {/* Table Header & Filters */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Riwayat Mutasi Saldo</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Detail pemasukan dan pengeluaran tabungan</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_month</span>
                                <select className="h-10 pl-9 pr-8 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer">
                                    <option>Bulan Ini</option>
                                    <option>3 Bulan Terakhir</option>
                                    <option>Tahun Ini</option>
                                </select>
                            </div>
                            <a href={tabungan ? route('laporan.tabungan.pdf') + `?siswa_id=${filters.siswa_id || tabungan.siswa_id}` : '#'} target="_blank" rel="noreferrer" className="h-10 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">print</span>
                                Cetak PDF
                            </a>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-700">
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Keterangan</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4 text-right">Nominal</th>
                                    <th className="px-6 py-4 text-right">Saldo Akhir</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                {mutasi.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                            {item.tanggal}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.jenis === 'setor' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Setoran
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> Penarikan
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 text-right whitespace-nowrap font-bold ${item.jenis === 'setor' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                            {item.jenis === 'setor' ? '+' : '-'} Rp {formatNumber(item.nominal)}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap text-slate-700 dark:text-slate-300 font-semibold">
                                            Rp {formatNumber(item.saldo)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}

BukuTabungan.layout = page => {
    // Note: We would ideally pass the siswa.nama here, but Since `layout` function doesn't easily get the page component's props until render, we can use a generic label or modify how we pass breadcrumbs if absolutely necessary. Let's stick with generic for layout wrapper if we don't have props, or we can just leave the AuthenticatedLayout as a wrapper for this specific page if we need dynamic breadcrumbs based on props. Actually, Inertia passes props to the layout function.
    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Tabungan Siswa', href: '/tabungan' }, { label: 'Buku Tabungan' }]}>
            {page}
        </AuthenticatedLayout>
    );
};
