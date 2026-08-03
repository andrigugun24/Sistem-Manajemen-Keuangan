import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import { useState } from 'react';
import {
    ArrowLeft,
    WalletCards,
    Save,
    Printer,
    Building2,
    Wallet,
    Info,
    Plus,
    X,
    Banknote,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Trash2
} from 'lucide-react';

export default function GajiGuruSlip() {
    const { guru = {}, gaji = null, saldoKas: backendSaldoKas = {}, filters = {} } = usePage().props;

    const pegawai = {
        id: guru.id,
        nip: guru.nip || '-',
        nama: guru.nama_guru || '-',
        jabatan: guru.instansi || '-',
        tipe: guru.instansi || 'GTT',
        statusGaji: gaji ? 'sudah_dibayar' : 'belum_dibayar',
        foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama_guru || 'G')}&background=bbf7d0&color=166534`
    };

    // Form State
    const [jenisKas, setJenisKas] = useState('umum');
    const [gajiPokok, setGajiPokok] = useState(gaji?.gaji_pokok || 0);
    const [processing, setProcessing] = useState(false);

    // Tunjangan dinamis
    const [listTunjangan, setListTunjangan] = useState(
        gaji?.detail_tunjangan || []
    );
    const [newTunjanganNama, setNewTunjanganNama] = useState('');
    const [newTunjanganNominal, setNewTunjanganNominal] = useState('');

    // Potongan dinamis
    const [listPotongan, setListPotongan] = useState(gaji?.detail_potongan || []);
    const [newPotonganNama, setNewPotonganNama] = useState('');
    const [newPotonganNominal, setNewPotonganNominal] = useState('');

    // Saldo — from backend
    const saldoKas = {
        umum: backendSaldoKas.umum || 0,
        bos: backendSaldoKas.bos || 0
    };
    const parseNumber = (val) => parseInt(val.toString().replace(/\D/g, '')) || 0;

    // Handlers
    const addTunjangan = () => {
        if (!newTunjanganNama || !newTunjanganNominal) return;
        setListTunjangan([...listTunjangan, { id: Date.now(), nama: newTunjanganNama, nominal: parseNumber(newTunjanganNominal) }]);
        setNewTunjanganNama('');
        setNewTunjanganNominal('');
    };

    const removeTunjangan = (id) => {
        setListTunjangan(listTunjangan.filter(t => t.id !== id));
    };

    const addPotongan = () => {
        if (!newPotonganNama || !newPotonganNominal) return;
        setListPotongan([...listPotongan, { id: Date.now(), nama: newPotonganNama, nominal: parseNumber(newPotonganNominal) }]);
        setNewPotonganNama('');
        setNewPotonganNominal('');
    };

    const removePotongan = (id) => {
        setListPotongan(listPotongan.filter(p => p.id !== id));
    };

    // Calculations
    const totalTunjangan = listTunjangan.reduce((sum, t) => sum + t.nominal, 0);
    const totalPotongan = listPotongan.reduce((sum, p) => sum + p.nominal, 0);
    const takeHomePay = gajiPokok + totalTunjangan - totalPotongan;

    const saldoSaatIni = jenisKas === 'umum' ? saldoKas.umum : saldoKas.bos;
    const estimasiSaldo = saldoSaatIni - takeHomePay;
    const isOverLimit = estimasiSaldo < 0;

    return (
        <>
            <Head title="Proses Gaji Pegawai" />

            <div className="max-w-6xl mx-auto pb-12 pt-6">
                {/* Header Page */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4 text-slate-800">
                        <Link href={route('kas.gaji.index')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800/50 hover:text-indigo-600 rounded-xl transition-all text-slate-500 dark:text-slate-400">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Proses Pembayaran Gaji</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Periode Februari 2026</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Form & Rincian */}
                    <div className="w-full lg:w-2/3 space-y-6">

                        {/* Identitas Pegawai Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-6 flex items-center gap-5">
                            <img src={pegawai.foto} alt={pegawai.nama} className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800 shadow-sm object-cover" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pegawai.nama}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{pegawai.nip}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{pegawai.jabatan}</span>
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-100 ml-1">{pegawai.tipe}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Komponen Gaji */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                                    <Banknote className="w-5 h-5 text-indigo-500" /> Rincian Komponen Gaji
                                </h3>

                                <div className="space-y-8">
                                    {/* 1. Pendapatan Pokok */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <span>Pendapatan Pokok</span>
                                        </h4>
                                        <div className="flex items-center justify-between py-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 bg-slate-50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:bg-white dark:bg-slate-900 transition-all">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Gaji Pokok / Honor Bulanan</span>
                                            <div className="relative w-48">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400 font-bold text-sm">Rp</span>
                                                <input
                                                    type="text"
                                                    value={gajiPokok ? formatNumber(gajiPokok) : ''}
                                                    onChange={(e) => setGajiPokok(parseNumber(e.target.value))}
                                                    disabled={gaji !== null}
                                                    className="w-full text-right border-none bg-transparent py-2 pl-10 pr-2 font-bold text-slate-900 dark:text-white focus:ring-0 text-sm disabled:opacity-70"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Tunjangan & Tambahan */}
                                    <div>
                                        <h4 className="text-sm font-bold flex items-center justify-between border-b border-emerald-100 pb-2 mb-3 text-emerald-800">
                                            <span className="flex items-center gap-1.5"><ArrowUpRight className="w-4 h-4 text-emerald-500" /> Pendapatan Tambahan / Tunjangan</span>
                                            <span className="text-emerald-700 font-black">{formatRp(totalTunjangan)}</span>
                                        </h4>
                                        <div className="space-y-2 mb-3">
                                            {listTunjangan.length === 0 && <p className="text-sm text-slate-400 italic py-2 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">Tidak ada tunjangan</p>}
                                            {listTunjangan.map((t, idx) => (
                                                <div key={t.id} className="flex items-center justify-between py-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 bg-white dark:bg-slate-900 group hover:border-emerald-300 transition-colors">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{idx + 1}. {t.nama}</span>
                                                    <div className="flex items-center gap-3 w-48 justify-end">
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{formatRp(t.nominal)}</span>
                                                        {gaji === null && (
                                                            <button onClick={() => removeTunjangan(t.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Tambah Field */}
                                        {gaji === null && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text" placeholder="Nama Tunjangan (Misal: Uang Makan)"
                                                    value={newTunjanganNama} onChange={e => setNewTunjanganNama(e.target.value)}
                                                    className="flex-1 text-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                                <input
                                                    type="text" placeholder="Nominal (Rp)"
                                                    value={newTunjanganNominal ? formatNumber(newTunjanganNominal) : ''}
                                                    onChange={e => setNewTunjanganNominal(parseNumber(e.target.value))}
                                                    className="w-32 sm:w-40 text-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-right"
                                                />
                                                <button onClick={addTunjangan} disabled={!newTunjanganNama || !newTunjanganNominal} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 disabled:opacity-50 transition-colors border border-emerald-200">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Potongan */}
                                    <div>
                                        <h4 className="text-sm font-bold flex items-center justify-between border-b border-rose-100 pb-2 mb-3 text-rose-800">
                                            <span className="flex items-center gap-1.5"><ArrowDownRight className="w-4 h-4 text-rose-500" /> Potongan</span>
                                            <span className="text-rose-600 font-black">{totalPotongan > 0 ? `-${formatRp(totalPotongan)}` : 'Rp 0'}</span>
                                        </h4>
                                        <div className="space-y-2 mb-3">
                                            {listPotongan.length === 0 && <p className="text-sm text-slate-400 italic py-2 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">Tidak ada potongan</p>}
                                            {listPotongan.map((p, idx) => (
                                                <div key={p.id} className="flex items-center justify-between py-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 bg-white dark:bg-slate-900 group hover:border-rose-300 transition-colors">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{idx + 1}. {p.nama}</span>
                                                    <div className="flex items-center gap-3 w-48 justify-end">
                                                        <span className="font-bold text-rose-600 text-sm">-{formatRp(p.nominal)}</span>
                                                        {gaji === null && (
                                                            <button onClick={() => removePotongan(p.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Tambah Field */}
                                        {gaji === null && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text" placeholder="Nama Potongan (Misal: Kasbon, Koperasi)"
                                                    value={newPotonganNama} onChange={e => setNewPotonganNama(e.target.value)}
                                                    className="flex-1 text-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-rose-500 focus:border-rose-500"
                                                />
                                                <input
                                                    type="text" placeholder="Nominal (Rp)"
                                                    value={newPotonganNominal ? formatNumber(newPotonganNominal) : ''}
                                                    onChange={e => setNewPotonganNominal(parseNumber(e.target.value))}
                                                    className="w-32 sm:w-40 text-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-rose-500 focus:border-rose-500 text-right"
                                                />
                                                <button onClick={addPotongan} disabled={!newPotonganNama || !newPotonganNominal} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 disabled:opacity-50 transition-colors border border-rose-200">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Ringkasan & Submit (Sticky) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 space-y-4">

                            {/* Take Home Pay Card */}
                            <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-2xl p-6 shadow-lg shadow-indigo-500/30 text-white relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-10">
                                    <span className="material-symbols-outlined text-[150px] transform rotate-12 -mr-8 -mt-8">payments</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        Take Home Pay (THP)
                                    </p>
                                    <h2 className="text-3xl font-black mb-6">{formatRp(takeHomePay < 0 ? 0 : takeHomePay)}</h2>

                                    <div className="space-y-2 border-t border-indigo-500/50 pt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-indigo-200">Gaji Pokok</span>
                                            <span className="font-semibold">{formatRp(gajiPokok)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-indigo-200">Total Tunjangan (+)</span>
                                            <span className="font-semibold text-emerald-300">{formatRp(totalTunjangan)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-indigo-200">Total Potongan (-)</span>
                                            <span className="font-semibold text-rose-300">{formatRp(totalPotongan)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sumber Dana & Submit */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden p-6">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Tarik Pencairan dari Kas:</h4>

                                <div className="space-y-3 mb-5">
                                    <label className={`relative border rounded-xl p-3 flex gap-3 transition-all ${jenisKas === 'umum' ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/50'} ${gaji !== null ? 'opacity-70' : 'cursor-pointer'}`}>
                                        <input type="radio" className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={jenisKas === 'umum'} onChange={() => setJenisKas('umum')} disabled={gaji !== null} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Kas Umum Yayasan</span>
                                                <Building2 className={`w-3.5 h-3.5 ${jenisKas === 'umum' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Saldo:</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatRp(saldoKas.umum)}</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`relative border rounded-xl p-3 flex gap-3 transition-all ${jenisKas === 'bos' ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/50'} ${gaji !== null ? 'opacity-70' : 'cursor-pointer'}`}>
                                        <input type="radio" className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={jenisKas === 'bos'} onChange={() => setJenisKas('bos')} disabled={gaji !== null} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Dana BOS Pusat</span>
                                                <Wallet className={`w-3.5 h-3.5 ${jenisKas === 'bos' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Saldo:</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatRp(saldoKas.bos)}</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {isOverLimit ? (
                                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex gap-2 text-xs mb-4">
                                        <Info className="w-4 h-4 shrink-0 text-rose-500" />
                                        <p className="font-semibold">Saldo Kas tidak mencukupi untuk pembayaran THP.</p>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 p-3 rounded-xl flex gap-2 text-xs mb-4">
                                        <Info className="w-4 h-4 shrink-0 text-slate-400" />
                                        <p>Saldo Kas {jenisKas === 'umum' ? 'Umum' : 'BOS'} akan berkurang otomatis sebesar THP saat gaji disimpan.</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {gaji === null ? (
                                        <button
                                            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 ${isOverLimit || takeHomePay <= 0
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-slate-300'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 focus:ring-indigo-500'
                                                }`}
                                            disabled={isOverLimit || takeHomePay <= 0 || processing}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setProcessing(true);
                                                router.post(route('kas.gaji.store'), {
                                                    guru_id: pegawai.id,
                                                    bulan: filters.bulan || new Date().getMonth() + 1,
                                                    tahun: filters.tahun || new Date().getFullYear(),
                                                    gaji_pokok: gajiPokok,
                                                    tunjangan: totalTunjangan,
                                                    potongan: totalPotongan,
                                                    detail_tunjangan: listTunjangan,
                                                    detail_potongan: listPotongan,
                                                    jenis_kas: jenisKas,
                                                }, {
                                                    onFinish: () => setProcessing(false),
                                                });
                                            }}
                                        >
                                            <Save className="w-4 h-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan & Update Kas'}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                disabled
                                                className="w-full py-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm cursor-not-allowed border border-emerald-200 dark:border-emerald-800/50"
                                            >
                                                <CheckCircle2 className="w-4 h-4 inline-block mr-2" /> Gaji Sudah Disimpan
                                            </button>
                                            <a
                                                href={route('kas.gaji.pdf', { penggajian: gaji.id })}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Printer className="w-4 h-4" /> Cetak Slip Gaji (PDF)
                                            </a>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Yakin ingin membatalkan dan menghapus data penggajian ini? Saldo kas akan otomatis dikembalikan.')) {
                                                        router.delete(route('kas.gaji.destroy', { penggajian: gaji.id }));
                                                    }
                                                }}
                                                className="w-full py-3.5 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-500 rounded-xl font-bold text-sm border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" /> Batalkan & Hapus Gaji
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

GajiGuruSlip.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Kas Sekolah', href: '#' },
        { label: 'Gaji Guru', href: route('kas.gaji.index') },
        { label: 'Proses Gaji' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
