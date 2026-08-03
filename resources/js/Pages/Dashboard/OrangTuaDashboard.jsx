import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import ChickenBankIcon from '@/Components/ChickenBankIcon';

export default function OrangTuaDashboard({ siswas = [] }) {
    const [selectedSiswaId, setSelectedSiswaId] = useState(siswas.length > 0 ? siswas[0].id : null);
    const [historyType, setHistoryType] = useState('pembayaran');

    const selectedSiswa = siswas.find(s => s.id === selectedSiswaId);

    if (!selectedSiswa) {
        return (
            <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard Keuangan' }]}>
                <Head title="Portal Orang Tua" />
                <div className="p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl max-w-md shadow-sm border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-4 block">sentiment_dissatisfied</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Belum Ada Data Siswa</h3>
                        <p className="text-slate-500 text-sm">Akun Anda belum dihubungkan dengan data siswa. Silakan hubungi tata usaha sekolah.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const childInfo = {
        nama: selectedSiswa.nama_lengkap,
        nisn: selectedSiswa.nisn,
        kelas: selectedSiswa.kelas,
        instansi: selectedSiswa.instansi,
        foto: null,
        saldoTabungan: selectedSiswa.saldo_tabungan || 0,
    };

    const tagihan = selectedSiswa.tagihan_aktif || [];

    const riwayatPembayaran = selectedSiswa.riwayat_pembayaran || [];
    const riwayatTabungan = selectedSiswa.riwayat_tabungan || [];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard Keuangan' }]}>
            <Head title="Portal Orang Tua" />
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-display bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 antialiased selection:bg-primary selection:text-white">

                {/* Header & Student Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Keuangan</h2>
                        <p className="text-slate-500 mt-1">Pantau status pembayaran dan tabungan ananda.</p>
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

                <div className="bg-white dark:bg-[#1e1c30] rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-[#2d2b42] overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                {childInfo.foto ? (
                                    <img alt={`Student portrait of ${childInfo.nama}`} className="w-full h-full object-cover" src={childInfo.foto} />
                                ) : (
                                    <span className="text-4xl font-bold text-white uppercase">{childInfo.nama.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-[#1e1c30] rounded-full flex items-center justify-center" title="Status Aktif">
                                <span className="material-symbols-outlined text-white text-[14px]">check</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            <div className="flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{childInfo.nama}</h3>
                                <div className="flex items-center gap-3 mt-1 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                                    <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-white dark:bg-slate-900/5 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-[16px]">id_card</span> NISN: {childInfo.nisn}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center border-l-0 md:border-l border-slate-100 dark:border-slate-700 md:pl-6">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Kelas Saat Ini</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white mt-1">{childInfo.kelas}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">Wali Kelas: {childInfo.waliKelas}</span>
                            </div>
                            <div className="bg-secondary/10 dark:bg-secondary/20 rounded-xl p-4 flex flex-col justify-between border border-secondary/20 h-full min-h-[100px]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        <ChickenBankIcon className="w-[18px] h-[18px]" />
                                        Saldo Tabungan
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight">Rp {formatNumber(childInfo.saldoTabungan || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Tagihan Aktif */}
                    <div className="col-span-1 bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                Tagihan Aktif
                            </h3>
                            <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Lihat Semua</button>
                        </div>
                        <div className="p-6 flex flex-col gap-4 flex-1">
                            {tagihan.length > 0 ? tagihan.map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/5 border border-slate-100 dark:border-slate-700 group hover:border-primary/30 transition-colors cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                            <span className="material-symbols-outlined">priority_high</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{item.jenis}</h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Jatuh Tempo: {item.jatuh_tempo}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Rp {formatNumber(item.nominal)}</span>
                                        <button className="px-3 py-1.5 bg-primary text-white text-[11px] font-semibold rounded-lg shadow-sm shadow-primary/30 hover:bg-primary-dark transition-colors">
                                            Bayar
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-500 text-sm">Tidak ada tagihan aktif.</div>
                            )}
                        </div>
                    </div>

                    {/* Riwayat Transaksi */}
                    <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Riwayat Transaksi
                            </h3>
                            <select
                                value={historyType}
                                onChange={(e) => setHistoryType(e.target.value)}
                                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white cursor-pointer w-full sm:w-auto"
                            >
                                <option value="pembayaran">Riwayat Pembayaran</option>
                                <option value="tabungan">Riwayat Tabungan</option>
                            </select>
                        </div>

                        {historyType === 'pembayaran' && (
                            <div className="p-0 relative flex-1 overflow-x-auto min-h-[300px]">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Waktu</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Pembayaran</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Metode</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {riwayatPembayaran.length > 0 ? riwayatPembayaran.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{item.tanggalBayar}</td>
                                                <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{item.jenis}</td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{item.metode}</td>
                                                <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">
                                                    Rp {formatNumber(item.nominal)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${item.status === 'lunas' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}`}>
                                                        {item.status === 'lunas' ? 'Berhasil' : 'Menunggu Verifikasi'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">Belum ada riwayat pembayaran.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {historyType === 'tabungan' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 min-h-[300px]">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900/[0.02]">
                                    <div className="w-full h-40 relative flex items-end gap-2 px-4">
                                        <div className="w-1/6 bg-primary/20 rounded-t-sm h-[40%] relative hover:bg-primary/40 transition-all"></div>
                                        <div className="w-1/6 bg-primary/30 rounded-t-sm h-[55%] relative hover:bg-primary/50 transition-all"></div>
                                        <div className="w-1/6 bg-primary/40 rounded-t-sm h-[45%] relative hover:bg-primary/60 transition-all"></div>
                                        <div className="w-1/6 bg-primary/50 rounded-t-sm h-[65%] relative hover:bg-primary/70 transition-all"></div>
                                        <div className="w-1/6 bg-primary/60 rounded-t-sm h-[80%] relative hover:bg-primary/80 transition-all"></div>
                                        <div className="w-1/6 bg-primary rounded-t-sm h-[95%] relative shadow-lg shadow-primary/20 group">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                +{riwayatTabungan.filter(x => x.type === 'in').length} Transaksi
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between w-full px-4 mt-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                                    </div>
                                    <p className="text-[10px] text-center text-slate-400 mt-4 italic">Tren aktivitas tabungan terbaru</p>
                                </div>
                                <div className="col-span-1 lg:col-span-2 overflow-x-auto min-h-[300px]">
                                    <table className="w-full text-left border-collapse min-w-[400px]">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Keterangan</th>
                                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
                                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {riwayatTabungan.length > 0 ? riwayatTabungan.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{item.tanggal}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${item.type === 'in' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    {item.type === 'in' ? 'arrow_downward' : 'arrow_upward'}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.keterangan}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`p-4 text-sm font-bold text-right ${item.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                        {item.type === 'in' ? '+' : '-'} Rp {formatNumber(item.nominal)}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">Belum ada mutasi tabungan.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
