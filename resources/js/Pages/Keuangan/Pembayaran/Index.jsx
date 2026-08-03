import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import Swal from 'sweetalert2';

export default function PembayaranIndex() {
    const { pembayarans = { data: [] }, stats = {}, flash = {}, filters = {} } = usePage().props;

    // ─── State ───
    const [searchSiswa, setSearchSiswa] = useState('');
    const [siswaResults, setSiswaResults] = useState([]);
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [currentTagihan, setCurrentTagihan] = useState([]);
    const [checkedTagihan, setCheckedTagihan] = useState({});
    const [customNominal, setCustomNominal] = useState({});
    const [metode, setMetode] = useState('tunai');
    const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get('status') || 'Semua');
    const [searchRiwayat, setSearchRiwayat] = useState(filters.search || '');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSearchRiwayat = (e) => {
        if (e.key === 'Enter') {
            router.get(route('pembayaran.index'), { status: activeTab, search: searchRiwayat }, { preserveState: true });
        }
    };

    // ─── API: Cari Siswa ───
    useEffect(() => {
        if (searchSiswa.length < 2) { setSiswaResults([]); return; }
        const timer = setTimeout(() => {
            fetch(route('api.cari-siswa') + '?q=' + encodeURIComponent(searchSiswa))
                .then(r => r.json())
                .then(data => setSiswaResults(data))
                .catch(() => setSiswaResults([]));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchSiswa]);

    // ─── Trigger SweetAlert Cetak Kuitansi ───
    useEffect(() => {
        if (flash.cetak_id) {
            Swal.fire({
                title: 'Pembayaran Berhasil!',
                text: 'Apakah Anda ingin mencetak kuitansi pembayaran ini sekarang?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#4f46e5', // indigo-600
                cancelButtonColor: '#94a3b8',  // slate-400
                confirmButtonText: '<span class="material-symbols-outlined align-middle mr-1 text-[18px]">print</span> Ya, Cetak',
                cancelButtonText: 'Tutup',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open(route('kuitansi.show', { pembayaran: flash.cetak_id }), '_blank');
                }
            });
        }
    }, [flash.cetak_id]);

    // ─── API: Tagihan per Siswa ───
    const loadTagihan = useCallback((siswaId) => {
        fetch(route('api.tagihan-siswa', { siswa: siswaId }))
            .then(r => r.json())
            .then(data => setCurrentTagihan(data))
            .catch(() => setCurrentTagihan([]));
    }, []);

    // ─── Derived ───
    const riwayatTransaksi = pembayarans.data || [];

    const totalBayar = useMemo(() => {
        return currentTagihan.reduce((sum, t) => {
            if (!checkedTagihan[t.id]) return sum;
            const custom = customNominal[t.id];
            return sum + (custom !== undefined ? custom : t.sisa);
        }, 0);
    }, [checkedTagihan, customNominal, currentTagihan]);

    // (Server-side handled, but fallback in case of no refresh)
    const filteredRiwayat = riwayatTransaksi;

    const menungguCount = riwayatTransaksi.filter(t => t.status_pembayaran === 'menunggu').length;

    // ─── Handlers ───
    const handleSelectSiswa = (siswa) => {
        setSelectedSiswa(siswa);
        setSearchSiswa('');
        setSiswaResults([]);
        setCheckedTagihan({});
        setCustomNominal({});
        loadTagihan(siswa.id);
    };

    const handleToggleTagihan = (id) => {
        setCheckedTagihan(prev => {
            const next = { ...prev };
            if (next[id]) { delete next[id]; setCustomNominal(p => { const n = { ...p }; delete n[id]; return n; }); }
            else next[id] = true;
            return next;
        });
    };

    const handleCheckAll = () => {
        if (Object.keys(checkedTagihan).length === currentTagihan.length) {
            setCheckedTagihan({});
            setCustomNominal({});
        } else {
            const all = {};
            currentTagihan.forEach(t => all[t.id] = true);
            setCheckedTagihan(all);
        }
    };

    const handleCustomNominal = (id, value) => {
        const num = parseInt(value.replace(/\D/g, '')) || 0;
        const tagihan = currentTagihan.find(t => t.id === id);
        if (tagihan) {
            setCustomNominal(prev => ({ ...prev, [id]: Math.min(num, tagihan.sisa) }));
        }
    };

    const handleVerifikasi = (id, action) => {
        router.post(route('pembayaran.verifikasi', { pembayaran: id }), { aksi: action }, {
            preserveScroll: true,
        });
    };

    const handleConfirmPayment = () => {
        if (processing) return;
        setProcessing(true);
        const items = currentTagihan
            .filter(t => checkedTagihan[t.id])
            .map(t => ({
                tagihan_id: t.id,
                nominal_bayar: customNominal[t.id] !== undefined ? customNominal[t.id] : t.sisa,
            }));

        router.post(route('pembayaran.store'), {
            siswa_id: selectedSiswa.id,
            metode_pembayaran: metode,
            items,
        }, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedSiswa(null);
                setCheckedTagihan({});
                setCustomNominal({});
                setCurrentTagihan([]);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head>
                <title>Pembayaran & Verifikasi</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex flex-col w-full pb-8">
                <div className="flex flex-col mb-5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pembayaran & Verifikasi</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Catat pembayaran siswa dan verifikasi transfer masuk</p>
                </div>

                {/* ══════════ TOP: Summary Cards ══════════ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-primary rounded-xl p-5 text-white shadow-md shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-32 w-32 -mr-8 -mt-8 rounded-full bg-white dark:bg-slate-900/10 blur-2xl group-hover:bg-white dark:bg-slate-900/20 transition-all"></div>
                        <div className="relative z-10">
                            <p className="text-indigo-100 text-sm font-medium mb-1.5">Total Hari Ini</p>
                            <h3 className="text-3xl font-bold">{formatRp(pembayarans.data?.filter(t => t.status_pembayaran === 'lunas').reduce((sum, t) => sum + (t.total_bayar || 0), 0) || 0)}</h3>
                            <div className="mt-3 flex items-center gap-1 text-[11px] bg-white/20 dark:bg-slate-900/20 w-fit px-2.5 py-1 rounded-md font-medium">
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                {riwayatTransaksi.filter(t => t.status_pembayaran === 'lunas').length} transaksi lunas
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1.5">Transaksi Hari Ini</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{riwayatTransaksi.filter(t => t.status_pembayaran === 'lunas').length} <span className="text-sm font-medium text-slate-400">Lunas</span></h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1.5">Menunggu Verifikasi</p>
                        <h3 className="text-3xl font-bold text-amber-600">{menungguCount}</h3>
                    </div>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ══════════ MIDDLE: Payment Form ══════════ */}
                    <div className="w-full flex flex-col gap-6">

                        {/* 🔍 Search Student - Full width */}
                        <div className="w-full flex flex-col md:flex-row gap-4">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 relative flex-1">
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Cari Siswa</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">search</span>
                                    </span>
                                    <input
                                        type="text"
                                        value={searchSiswa}
                                        onChange={(e) => { setSearchSiswa(e.target.value); if (selectedSiswa) setSelectedSiswa(null); }}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="Ketik Nama atau NISN..."
                                    />
                                </div>

                                {/* Dropdown hasil pencarian */}
                                {searchSiswa.length >= 2 && !selectedSiswa && (
                                    <div className="mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden absolute left-0 right-0 mx-4 z-30 max-h-48 overflow-y-auto">
                                        {siswaResults.length > 0 ? siswaResults.map(siswa => (
                                            <button
                                                key={siswa.id}
                                                onClick={() => handleSelectSiswa(siswa)}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center gap-3"
                                            >
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">{siswa.nama.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{siswa.nama_lengkap || siswa.nama}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">NISN: {siswa.nisn} • Kelas {siswa.kelas?.nama_kelas || siswa.kelas || '-'}</p>
                                                </div>
                                            </button>
                                        )) : (
                                            <div className="px-4 py-3 text-sm text-slate-400 text-center">Siswa tidak ditemukan</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 👤 Student Card */}
                            {selectedSiswa && (
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-4 flex items-center gap-4 flex-1">
                                    <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                                        <span className="text-white text-lg font-bold">{(selectedSiswa.nama_lengkap || selectedSiswa.nama || '?').charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{selectedSiswa.nama_lengkap || selectedSiswa.nama}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="inline-flex items-center rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Kelas {selectedSiswa.kelas?.nama_kelas || selectedSiswa.kelas || '-'}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">NISN: {selectedSiswa.nisn}</span>
                                        </div>
                                        {currentTagihan.length > 0 && (
                                            <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                                {currentTagihan.length} tagihan belum lunas • Total {formatRp(currentTagihan.reduce((s, t) => s + t.sisa, 0))}
                                            </p>
                                        )}
                                    </div>
                                    <button onClick={() => { setSelectedSiswa(null); setCheckedTagihan({}); setCustomNominal({}); }} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 📋 Daftar Tagihan - Full width below */}
                        <div className="w-full flex flex-col gap-4">
                            {selectedSiswa ? (
                                <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col`}>
                                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                                            Daftar Tagihan Siswa
                                        </h3>
                                        {currentTagihan.length > 0 && (
                                            <button onClick={handleCheckAll} className="text-xs font-semibold text-primary hover:text-indigo-700 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                                                {Object.keys(checkedTagihan).length === currentTagihan.length ? 'Batal Semua' : 'Pilih Semua'}
                                            </button>
                                        )}
                                    </div>

                                    {currentTagihan.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[200px]">
                                            <span className="material-symbols-outlined text-[48px] mb-2 text-emerald-400">check_circle</span>
                                            <p className="text-base font-medium text-slate-600 dark:text-slate-400">Semua tagihan sudah lunas! 🎉</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                                            {currentTagihan.map((t, index) => {
                                                const isChecked = !!checkedTagihan[t.id];
                                                const hasCustom = customNominal[t.id] !== undefined;
                                                const isCicilan = hasCustom && customNominal[t.id] < (t.sisa_tagihan || t.sisa);
                                                const kategoriNama = t.kategori_tagihan?.nama_kategori || t.kategori || '-';
                                                const urutan = kategoriNama.includes('Infaq') || kategoriNama.includes('SPP') ? (index + 1) : null;

                                                const title = urutan ? `${kategoriNama} ${urutan}` : kategoriNama;

                                                return (
                                                    <div
                                                        key={t.id}
                                                        onClick={() => handleToggleTagihan(t.id)}
                                                        className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer transition-all ${isChecked
                                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                                                                {isChecked && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.bulan_tagihan || t.bulan || ''}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right flex-shrink-0">
                                                                <p className={`text-sm font-bold ${isChecked ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{formatRp(t.sisa_tagihan || t.sisa)}</p>
                                                                {(t.sisa_tagihan || t.sisa) < (t.nominal_tagihan || t.nominal) && (
                                                                    <p className="text-[10px] text-slate-400 line-through">{formatRp(t.nominal_tagihan || t.nominal)}</p>
                                                                )}
                                                            </div>

                                                            {/* Cicilan input */}
                                                            {isChecked ? (
                                                                <div className="w-40 border-l border-primary/20 pl-4 py-1" onClick={e => e.stopPropagation()}>
                                                                    <div className="relative">
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 dark:text-slate-400 text-xs font-medium">Rp</span>
                                                                        <input
                                                                            type="text"
                                                                            value={hasCustom ? customNominal[t.id].toLocaleString('id-ID') : formatNumber(t.sisa_tagihan || t.sisa || 0)}
                                                                            onChange={(e) => handleCustomNominal(t.id, e.target.value)}
                                                                            className="w-full rounded-md border border-slate-300 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-2 text-sm font-bold text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary text-right shadow-sm"
                                                                        />
                                                                    </div>
                                                                    {isCicilan && (
                                                                        <p className="text-[10px] text-amber-600 font-medium mt-1">
                                                                            Sisa: {formatRp((t.sisa_tagihan || t.sisa) - customNominal[t.id])}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : <div className="w-40"></div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Payment method & Submit */}
                                    {Object.keys(checkedTagihan).length > 0 && (
                                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 rounded-b-xl flex flex-col md:flex-row gap-6">
                                            {/* Method */}
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Metode Pembayaran</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { value: 'tunai', label: 'Tunai', icon: 'payments' },
                                                        { value: 'transfer', label: 'Transfer', icon: 'account_balance' },
                                                        { value: 'qris', label: 'QRIS', icon: 'qr_code_2' },
                                                    ].map(m => (
                                                        <button
                                                            key={m.value}
                                                            onClick={() => setMetode(m.value)}
                                                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${metode === m.value
                                                                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                                                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                                                            {m.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                {metode !== 'tunai' && (
                                                    <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">info</span>
                                                        Pembayaran non-tunai akan masuk dengan status "Menunggu Verifikasi"
                                                    </p>
                                                )}
                                            </div>

                                            {/* Total & Submit */}
                                            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-center">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Bayar</span>
                                                    <span className="text-2xl font-bold text-primary">{formatRp(totalBayar)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                    <span>{Object.keys(checkedTagihan).length} Tagihan Terpilih</span>
                                                    <span>Metode: {metode.toUpperCase()}</span>
                                                </div>
                                                <button
                                                    onClick={() => setShowConfirmModal(true)}
                                                    className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                    Konfirmasi Pembayaran
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed p-12 flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                                    <div className="h-16 w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <span className="material-symbols-outlined text-[32px] text-slate-300">receipt_long</span>
                                    </div>
                                    <p className="text-base font-medium text-slate-500 dark:text-slate-400">Pilih siswa terlebih dahulu untuk melihat tagihan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══════════ BOTTOM: Transaction History (Full Width) ══════════ */}
                    <div className="w-full flex flex-col">
                        {/* Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Riwayat Transaksi</h3>
                                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="relative w-full md:w-64">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <span className="material-symbols-outlined text-[18px]">search</span>
                                        </span>
                                        <input
                                            type="text"
                                            value={searchRiwayat}
                                            onChange={(e) => setSearchRiwayat(e.target.value)}
                                            onKeyDown={handleSearchRiwayat}
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                            placeholder="Cari Ref / Siswa (Enter)"
                                        />
                                    </div>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 w-full md:w-auto">
                                        {['Semua', 'Menunggu', 'Lunas', 'Ditolak'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => {
                                                    setActiveTab(tab);
                                                    router.get(route('pembayaran.index'), { status: tab, search: searchRiwayat }, { preserveState: true });
                                                }}
                                                className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === tab
                                                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'
                                                    }`}
                                            >
                                                {tab}
                                                {tab === 'Menunggu' && menungguCount > 0 && (
                                                    <span className="ml-1 inline-flex items-center justify-center bg-amber-100 text-amber-700 h-4 min-w-[16px] rounded-full text-[9px] font-bold">{menungguCount}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waktu</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Siswa</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis Tagihan</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Nominal</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Metode</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-28">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredRiwayat.map((row, index) => (
                                            <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors group">
                                                <td className="px-4 py-3.5 text-sm text-slate-400">{index + 1}</td>
                                                <td className="px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{row.tanggal_bayar ? new Date(row.tanggal_bayar).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                                <td className="px-4 py-3.5 text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-md bg-slate-100 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                                        {(row.siswa?.nama_lengkap || '?').charAt(0)}
                                                    </div>
                                                    {row.siswa?.nama_lengkap || '-'}
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">{row.detail_pembayarans?.[0]?.tagihan?.kategori_tagihan?.nama_kategori || row.no_referensi}</td>
                                                <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white text-right">{formatRp(row.total_bayar)}</td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${row.metode_pembayaran === 'tunai' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                                        row.metode_pembayaran === 'transfer' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                            'bg-purple-50 text-purple-700 ring-purple-700/10'
                                                        }`}>
                                                        {row.metode_pembayaran}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${row.status_pembayaran === 'lunas' ? 'bg-emerald-100/60 text-emerald-700' :
                                                        row.status_pembayaran === 'menunggu' ? 'bg-amber-100/60 text-amber-700' :
                                                            'bg-red-100/60 text-red-700'
                                                        }`}>
                                                        {row.status_pembayaran === 'lunas' ? '✓ Lunas' : row.status_pembayaran === 'menunggu' ? '⏳ Menunggu' : '✕ Ditolak'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="flex justify-center gap-1">
                                                        {row.status_pembayaran === 'menunggu' ? (
                                                            <>
                                                                <button onClick={() => handleVerifikasi(row.id, 'setuju')} className="p-1 px-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-md shadow-sm transition-all" title="Setujui">
                                                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                                                </button>
                                                                <button onClick={() => handleVerifikasi(row.id, 'tolak')} className="p-1 px-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 rounded-md shadow-sm transition-all" title="Tolak">
                                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => window.open(route('kuitansi.show', { pembayaran: row.id }), '_blank')}
                                                                className="p-1 px-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary rounded-md hover:bg-slate-50 dark:bg-slate-800/50 transition-all opacity-0 group-hover:opacity-100"
                                                                title="Cetak Struk"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">print</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredRiwayat.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                                                    Tidak ada transaksi {activeTab !== 'Semua' ? `dengan status "${activeTab}"` : ''}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Menampilkan {pembayarans.from || 0}-{pembayarans.to || 0} dari {pembayarans.total || 0} transaksi</p>
                                <div className="flex gap-1">
                                    {pembayarans.links?.map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.get(link.url, { status: activeTab }, { preserveState: true })}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`p-1 px-2 text-xs rounded border ${link.active ? 'bg-primary text-white border-primary' : 'hover:bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'} disabled:opacity-50`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════ Confirmation Modal ══════════ */}
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-[28px]">check_circle</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Konfirmasi Pembayaran</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Pastikan data sudah benar</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Siswa</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{selectedSiswa?.nama_lengkap || selectedSiswa?.nama}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Kelas / NISN</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{selectedSiswa?.kelas?.nama_kelas || selectedSiswa?.kelas || '-'} / {selectedSiswa?.nisn}</span>
                                    </div>
                                    <hr className="border-slate-200 dark:border-slate-700" />
                                    {currentTagihan.filter(t => checkedTagihan[t.id]).map(t => (
                                        <div key={t.id} className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">{t.kategori_tagihan?.nama_kategori || t.kategori || '-'} {t.bulan_tagihan ? `(${t.bulan_tagihan})` : t.bulan && t.bulan !== '-' ? `(${t.bulan})` : ''}</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {formatRp(customNominal[t.id] !== undefined ? customNominal[t.id] : (t.sisa_tagihan || t.sisa))}
                                                {customNominal[t.id] !== undefined && customNominal[t.id] < (t.sisa_tagihan || t.sisa) && (
                                                    <span className="text-amber-600 text-[10px] ml-1">(cicilan)</span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    <hr className="border-slate-200 dark:border-slate-700" />
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Metode</span>
                                        <span className={`font-semibold ${metode === 'tunai' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {metode === 'tunai' ? '💵 Tunai' : metode === 'transfer' ? '🏦 Transfer Bank' : '📱 QRIS'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-slate-900 dark:text-white">TOTAL BAYAR</span>
                                        <span className="text-xl font-bold text-primary">{formatRp(totalBayar)}</span>
                                    </div>
                                    {metode !== 'tunai' && (
                                        <div className="bg-amber-50 text-amber-700 text-xs font-medium rounded-lg p-2.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">info</span>
                                            Status akan menjadi "Menunggu Verifikasi" sampai bukti transfer dikonfirmasi
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                                <button onClick={() => setShowConfirmModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800/50 transition-all">
                                    Batal
                                </button>
                                <button onClick={handleConfirmPayment} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Ya, Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
                    @keyframes animate-in {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-in { animation: animate-in 0.2s ease-out; }
                `}} />
            </div>
        </>
    );
}

PembayaranIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Keuangan', href: '#' }, { label: 'Pembayaran & Verifikasi' }]}>
        {page}
    </AuthenticatedLayout>
);
