import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    WalletCards,
    ChevronRight,
    Download,
    Printer,
    Calculator,
    FileText
} from 'lucide-react';

export default function GajiGuruIndex() {
    const { dataPegawai = [], stats = {}, filters = {} } = usePage().props;

    // State
    const [bulanKerja, setBulanKerja] = useState(`${filters.tahun || new Date().getFullYear()}-${String(filters.bulan || new Date().getMonth() + 1).padStart(2, '0')}`);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('semua');

    // Filter Logic
    // Add foto URL + jabatan fallback to each pegawai item
    const enrichedData = dataPegawai.map(p => ({
        ...p,
        foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nama || 'G')}&background=bbf7d0&color=166534`,
        jabatan: p.instansi || '-',
        tipe: p.instansi || '-',
    }));

    const filteredData = enrichedData.filter(p => {
        const matchSearch = (p.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.nip || '').includes(searchQuery);
        const matchStatus = statusFilter === 'semua' ? true : p.statusGaji === statusFilter;
        return matchSearch && matchStatus;
    });

    // Summary Stats
    const totalPegawai = stats.totalPegawai || dataPegawai.length;
    const sudahDibayar = stats.sudahDibayar || dataPegawai.filter(p => p.statusGaji === 'sudah_dibayar').length;
    const persentase = totalPegawai > 0 ? Math.round((sudahDibayar / totalPegawai) * 100) : 0;
    const estimasiBeban = stats.estimasiBeban || dataPegawai.reduce((sum, p) => sum + (p.nominal || 0), 0);
    const nominalTerbayar = stats.nominalTerbayar || dataPegawai.filter(p => p.statusGaji === 'sudah_dibayar').reduce((sum, p) => sum + (p.nominal || 0), 0);

    return (
        <>
            <Head title="Penggajian Guru & Karyawan" />

            <div className="h-full flex flex-col font-display pb-12">
                {/* Header / Page Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <WalletCards className="w-7 h-7 text-indigo-500 bg-indigo-100 p-1.5 rounded-lg" />
                            Penggajian Pegawai
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola pencatatan beban dan penerbitan slip gaji bulanan</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={route('kas.gaji.rekap.pdf') + `?bulan=${bulanKerja.split('-')[1]}&tahun=${bulanKerja.split('-')[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                        >
                            <Printer className="w-4 h-4" /> Cetak Rekap
                        </a>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full mix-blend-multiply opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Periode Aktif</p>
                            <input
                                type="month"
                                value={bulanKerja}
                                onChange={(e) => {
                                    setBulanKerja(e.target.value);
                                    const [tahun, bulan] = e.target.value.split('-');
                                    router.get(route('kas.gaji.index'), { bulan, tahun }, { preserveState: true });
                                }}
                                className="bg-transparent border-0 font-bold text-xl text-slate-900 dark:text-white p-0 focus:ring-0 cursor-pointer w-full hover:text-indigo-600 transition-colors"
                            />
                            <p className="text-xs text-indigo-600 mt-1 cursor-pointer hover:underline font-medium">Ubah Periode</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progres Pembayaran</p>
                            <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                                {persentase}%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{sudahDibayar} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">dari {totalPegawai} Staf</span></h3>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${persentase}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700 shadow-sm lg:col-span-2 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-overlay opacity-20 blur-2xl"></div>
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Telah Dibayarkan / Beban Gaji</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-white tracking-tight">{formatRp(nominalTerbayar)}</h3>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ {formatRp(estimasiBeban)}</span>
                                </div>
                            </div>
                            <div className="hidden sm:block mb-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 shadow-inner">
                                    <CheckCircle2 className="w-4 h-4" /> Sesuai Estimasi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50/50 justify-between items-center">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full sm:w-64 shrink-0">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NIP..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                            <div className="relative shrink-0 w-full sm:w-auto">
                                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full sm:w-auto pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                >
                                    <option value="semua">Semua Status</option>
                                    <option value="belum_dibayar">Belum Dibayar</option>
                                    <option value="sudah_dibayar">Sudah Dibayar</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                    <th className="px-6 py-4 w-12 text-center">No</th>
                                    <th className="px-6 py-4">Pegawai (Guru / Staf)</th>
                                    <th className="px-6 py-4">Status Penggajian</th>
                                    <th className="px-6 py-4 text-right">Estimasi / Diterima</th>
                                    <th className="px-6 py-4 text-center w-36">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredData.length > 0 ? filteredData.map((pegawai, index) => (
                                    <tr key={pegawai.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-center font-medium text-slate-400">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={pegawai.foto} alt={pegawai.nama} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover shadow-sm" />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 transition-colors">{pegawai.nama}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{pegawai.nip}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                                        <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">{pegawai.jabatan}</span>
                                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100 ml-1">{pegawai.tipe}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {pegawai.statusGaji === 'sudah_dibayar' ? (
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs border border-emerald-100/50">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Selesai Dibayar
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3 text-slate-400" /> Tgl: <span className="text-slate-700 dark:text-slate-300">{pegawai.tanggalBayar}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs border border-amber-200/50 shadow-sm animate-pulse">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Menunggu Proses
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`font-black text-base ${pegawai.statusGaji === 'sudah_dibayar' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                {formatRp(pegawai.nominal)}
                                            </div>
                                            {pegawai.statusGaji === 'belum_dibayar' && (
                                                <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">ESTIMASI THP</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {pegawai.statusGaji === 'belum_dibayar' ? (
                                                <Link
                                                    href={route('kas.gaji.slip', { guru: pegawai.id })}
                                                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-95 group-hover:scale-105"
                                                >
                                                    Proses Gaji
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={route('kas.gaji.slip', { guru: pegawai.id })}
                                                    className="inline-flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all gap-1.5 shadow-sm"
                                                >
                                                    <FileText className="w-3.5 h-3.5" /> Slip Gaji
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
                                                    <Search className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <p className="font-semibold text-slate-600 dark:text-slate-400">Pencarian Tidak Ditemukan</p>
                                                <p className="text-sm">Tidak ada data pegawai yang cocok dengan filter atau kata kunci "{searchQuery}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

GajiGuruIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Kas Sekolah', href: '#' }, { label: 'Gaji Guru & Staf' }]}>
        {page}
    </AuthenticatedLayout>
);
