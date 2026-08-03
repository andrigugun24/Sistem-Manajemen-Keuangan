import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Users, Receipt, Info, Save } from 'lucide-react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function TagihanCreate() {
    const { kategoriTagihans = [], kelasList = [], tahunAjaranAktif, totalSiswaAktif = 0 } = usePage().props;

    // Form State
    const [kategori, setKategori] = useState('');
    const [kelasTarget, setKelasTarget] = useState('semua');
    const [opsiBulan, setOpsiBulan] = useState('satu_tahun');
    const [bulanSpesifik, setBulanSpesifik] = useState('');
    const [processing, setProcessing] = useState(false);
    const [customSearch, setCustomSearch] = useState('');
    const [customResults, setCustomResults] = useState([]);
    const [selectedCustomSiswas, setSelectedCustomSiswas] = useState([]);

    const selectedKategori = kategoriTagihans.find(k => k.id === parseInt(kategori));

    // Calculate totals dynamically — SMP: kelas 7-9, SMA: kelas 10-12
    const jumlahSiswa79 = kelasList
        .filter(k => /^(7|8|9|VII|VIII|IX)\b/i.test(k.nama_kelas) || /\b(7|8|9|VII|VIII|IX)\b/i.test(k.nama_kelas))
        .reduce((sum, k) => sum + (k.siswas_count || 0), 0);

    const jumlahSiswa1012 = kelasList
        .filter(k => /^(10|11|12|X|XI|XII)\b/i.test(k.nama_kelas) || /\b(10|11|12|X|XI|XII)\b/i.test(k.nama_kelas))
        .reduce((sum, k) => sum + (k.siswas_count || 0), 0);

    const getTargetSiswaCount = () => {
        if (kelasTarget === 'semua') return totalSiswaAktif;
        if (kelasTarget === '79') return jumlahSiswa79;
        if (kelasTarget === '1012') return jumlahSiswa1012;
        if (kelasTarget === 'custom') return selectedCustomSiswas.length;
        return 0;
    };

    const targetCount = getTargetSiswaCount();

    const handleSubmit = () => {
        if (!kategori || !tahunAjaranAktif || targetCount === 0) return;
        setProcessing(true);
        router.post(route('tagihan.store'), {
            kategori_tagihan_id: kategori,
            target_kelas: kelasTarget,
            opsi_bulan: selectedKategori?.jenis_tagihan === 'Bulanan' ? opsiBulan : 'sekali_bayar',
            bulan_spesifik: bulanSpesifik,
            tahun_ajaran_id: tahunAjaranAktif.id,
            custom_siswa_ids: kelasTarget === 'custom' ? selectedCustomSiswas.map(s => s.id) : [],
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Generate Tagihan" />

            <div className="max-w-5xl mx-auto pb-12 pt-6">
                {/* Header Page */}
                <div className="flex items-center gap-4 mb-8 text-slate-800">
                    <Link href={route('tagihan.index')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800/50 hover:text-primary rounded-xl transition-all text-slate-500 dark:text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Generate Tagihan Batch</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Buat otomatis tagihan untuk banyak siswa sekaligus sesuai data master</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Form Fields */}
                    <div className="w-full lg:w-2/3 space-y-6">

                        {/* Section 1: Informasi Dasar */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                                    <Receipt className="w-5 h-5 text-primary" /> Informasi Dasar Tagihan
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pilih Jenis Tagihan <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary text-slate-800 font-medium text-sm p-3.5 shadow-sm transition-colors cursor-pointer"
                                            value={kategori}
                                            onChange={(e) => setKategori(e.target.value)}
                                        >
                                            <option value="" disabled>-- Pilih jenis tagihan yang tersedia --</option>
                                            {kategoriTagihans.map(k => (
                                                <option key={k.id} value={k.id}>{k.nama_kategori} ({k.jenis_tagihan})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedKategori && (
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                                            <div>
                                                <p className="text-slate-700 dark:text-slate-300">Setiap siswa yang terpilih akan dibebankan tagihan sebesar <strong className="text-slate-900 dark:text-white border-b border-blue-200 pb-0.5">{formatRp(selectedKategori.nominal_default)}</strong>.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Opsi Bulan hanya muncul jika tagihan adalah bulanan */}
                                    {selectedKategori?.jenis_tagihan === 'Bulanan' && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Target Bulan (Periode) <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label className={`relative border rounded-xl p-4 cursor-pointer flex gap-3 transition-all ${opsiBulan === 'satu_tahun' ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/50'}`}>
                                                    <input type="radio" className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={opsiBulan === 'satu_tahun'} onChange={() => setOpsiBulan('satu_tahun')} />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">1 Tahun Penuh</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Siswa memiliki 12 rekapan tagihan (Juli - Juni) sekaligus di akunnya.</p>
                                                    </div>
                                                </label>
                                                <label className={`relative border rounded-xl p-4 cursor-pointer flex gap-3 transition-all ${opsiBulan === 'satu_bulan' ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/50'}`}>
                                                    <input type="radio" className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={opsiBulan === 'satu_bulan'} onChange={() => setOpsiBulan('satu_bulan')} />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Bulan Spesifik Saja</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Pilih spesifik 1 bulan tertentu saja untuk di-generate.</p>
                                                    </div>
                                                </label>
                                            </div>

                                            {opsiBulan === 'satu_bulan' && (
                                                <div className="mt-5 animate-in fade-in slide-in-from-top-2">
                                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Pilih Bulan Tagihan</label>
                                                    <select value={bulanSpesifik} onChange={(e) => setBulanSpesifik(e.target.value)} className="w-full sm:w-1/2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary text-slate-800 font-medium text-sm p-3.5 shadow-sm cursor-pointer">
                                                        <option value="" disabled>-- Pilih Bulan --</option>
                                                        <option value="Juli">Juli</option>
                                                        <option value="Agustus">Agustus</option>
                                                        <option value="September">September</option>
                                                        <option value="Oktober">Oktober</option>
                                                        <option value="November">November</option>
                                                        <option value="Desember">Desember</option>
                                                        <option value="Januari">Januari</option>
                                                        <option value="Februari">Februari</option>
                                                        <option value="Maret">Maret</option>
                                                        <option value="April">April</option>
                                                        <option value="Mei">Mei</option>
                                                        <option value="Juni">Juni</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Target Siswa */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                                    <Users className="w-5 h-5 text-primary" /> Tentukan Target Penerima Tagihan
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Terapkan Tagihan Secara Massal Pada <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 gap-3">
                                            <label className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${kelasTarget === 'semua' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                                                <div className="flex gap-3">
                                                    <input type="radio" className="mt-0.5 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={kelasTarget === 'semua'} onChange={() => setKelasTarget('semua')} />
                                                    <div>
                                                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Seluruh Siswa Aktif</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Semua kelas dari tingkat 7 hingga 12</span>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">{totalSiswaAktif} Siswa</span>
                                            </label>

                                            <label className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${kelasTarget === '79' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                                                <div className="flex gap-3">
                                                    <input type="radio" className="mt-0.5 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={kelasTarget === '79'} onChange={() => setKelasTarget('79')} />
                                                    <div>
                                                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Siswa Kelas 7 s/d 9 (SMP)</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Hanya tingkat SMP</span>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">{jumlahSiswa79} Siswa</span>
                                            </label>

                                            <label className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${kelasTarget === '1012' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                                                <div className="flex gap-3">
                                                    <input type="radio" className="mt-0.5 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={kelasTarget === '1012'} onChange={() => setKelasTarget('1012')} />
                                                    <div>
                                                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Siswa Kelas 10 s/d 12 (SMA)</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Hanya tingkat SMA</span>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">{jumlahSiswa1012} Siswa</span>
                                            </label>

                                            <label className={`border border-dashed rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${kelasTarget === 'custom' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary shadow-sm' : 'border-slate-300 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-400'}`}>
                                                <div className="flex gap-3">
                                                    <input type="radio" className="mt-0.5 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" checked={kelasTarget === 'custom'} onChange={() => setKelasTarget('custom')} />
                                                    <div>
                                                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Pilih Siswa Spesifik (Custom)</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">Cari manual nama siswa yang dituju</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {kelasTarget === 'custom' && (
                                        <div className="mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Cari Nama / NISN Siswa</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Ketik nama atau NISN siswa..."
                                                        value={customSearch}
                                                        onChange={(e) => {
                                                            setCustomSearch(e.target.value);
                                                            if (e.target.value.length >= 2) {
                                                                fetch(route('api.cari-siswa') + '?q=' + encodeURIComponent(e.target.value))
                                                                    .then(r => r.json())
                                                                    .then(data => setCustomResults(data))
                                                                    .catch(() => setCustomResults([]));
                                                            } else {
                                                                setCustomResults([]);
                                                            }
                                                        }}
                                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary focus:border-primary text-slate-800 dark:text-white text-sm p-3 shadow-sm"
                                                    />
                                                    {customResults.length > 0 && (
                                                        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                                            {customResults.map(siswa => (
                                                                <button
                                                                    key={siswa.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (!selectedCustomSiswas.find(s => s.id === siswa.id)) {
                                                                            setSelectedCustomSiswas(prev => [...prev, siswa]);
                                                                        }
                                                                        setCustomSearch('');
                                                                        setCustomResults([]);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors text-sm flex items-center justify-between border-b border-slate-100 dark:border-slate-700 last:border-0"
                                                                >
                                                                    <div>
                                                                        <p className="font-bold text-slate-900 dark:text-white">{siswa.nama_lengkap || siswa.nama}</p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">NISN: {siswa.nisn} • Kelas: {siswa.kelas?.nama_kelas || siswa.kelas || '-'}</p>
                                                                    </div>
                                                                    {selectedCustomSiswas.find(s => s.id === siswa.id) && (
                                                                        <span className="text-xs text-emerald-600 font-bold">✓ Terpilih</span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedCustomSiswas.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{selectedCustomSiswas.length} siswa dipilih:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedCustomSiswas.map(s => (
                                                            <span key={s.id} className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/20">
                                                                {s.nama_lengkap || s.nama}
                                                                <button type="button" onClick={() => setSelectedCustomSiswas(prev => prev.filter(x => x.id !== s.id))} className="text-blue-400 hover:text-red-500 transition-colors ml-1">×</button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Konfirmasi & Submit (Sticky) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">Ringkasan Eksekusi</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">Sistem akan men-generate data tagihan berdasarkan parameter yang Anda pilih di samping.</p>

                                <div className="bg-white dark:bg-slate-900 border text-sm border-slate-200 dark:border-slate-700 shadow-sm rounded-xl overflow-hidden mb-6">
                                    <ul className="divide-y divide-slate-100">
                                        <li className="flex justify-between items-start p-3.5 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Kategori</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-right w-1/2 break-words">{selectedKategori?.nama_kategori || '-'}</span>
                                        </li>
                                        <li className="flex justify-between items-start p-3.5 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Periode</span>
                                            <div className="text-right w-1/2">
                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                    {!selectedKategori ? '-' : selectedKategori.jenis_tagihan === 'Bulanan'
                                                        ? (opsiBulan === 'satu_tahun' ? '1 Tahun Penuh' : `Bulan ${bulanSpesifik || '-'}`)
                                                        : 'Sekali Bayar'}
                                                </span>
                                                {selectedKategori?.jenis_tagihan === 'Bulanan' && opsiBulan === 'satu_tahun' && (
                                                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1 inline-block">12 data per siswa</span>
                                                )}
                                            </div>
                                        </li>
                                        <li className="flex justify-between items-start p-3.5 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Target Siswa</span>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                    {kelasTarget === 'semua' ? 'Semua Kelas' : kelasTarget === '79' ? 'Kelas 7, 8, 9' : kelasTarget === '1012' ? 'Kelas 10, 11, 12' : 'Custom Siswa'}
                                                </span>
                                                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mt-1 inline-block">
                                                    ±{targetCount} Siswa
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex justify-between items-center p-3.5 bg-slate-50/50 border-t border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-600 dark:text-slate-400 font-semibold">Total Nilai Tagihan</span>
                                            <span className="font-black text-primary text-base">
                                                {formatRp((selectedKategori?.nominal_default || 0) * (selectedKategori?.jenis_tagihan === 'Bulanan' && opsiBulan === 'satu_tahun' ? 12 : 1) * targetCount)}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-800 shadow-sm mb-6">
                                    <Info className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                                    <p className="leading-relaxed">
                                        Proses generate data memakan waktu <strong className="font-bold">2-5 detik</strong>. Tergantung dari total siswa yang menjadi target tagihan.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={processing || !kategori || targetCount === 0 || (selectedKategori?.jenis_tagihan === 'Bulanan' && opsiBulan === 'satu_bulan' && !bulanSpesifik)}
                                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 ${(processing || !kategori || targetCount === 0 || (selectedKategori?.jenis_tagihan === 'Bulanan' && opsiBulan === 'satu_bulan' && !bulanSpesifik))
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30 focus:ring-emerald-500'
                                        }`}
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Memproses...' : 'Generate Tagihan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

TagihanCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Keuangan', href: '#' },
        { label: 'Tagihan Siswa', href: route('tagihan.index') },
        { label: 'Buat Tagihan Baru' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
