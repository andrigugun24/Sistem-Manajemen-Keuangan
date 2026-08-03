import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Save, FileText, CalendarClock, ArrowDownLeft } from 'lucide-react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function KasMasukCreate() {
    const { kategoriKeuangans = [] } = usePage().props;
    const [kategoriId, setKategoriId] = useState('');
    const [nominal, setNominal] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [keterangan, setKeterangan] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleNominalChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setNominal(val ? parseInt(val) : '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!kategoriId || !nominal || nominal <= 0 || processing) return;
        setProcessing(true);
        router.post(route('kas.masuk.store'), {
            kategori_keuangan_id: kategoriId,
            nominal: parseInt(nominal),
            keterangan,
            tanggal_transaksi: tanggal,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Catat Penerimaan Kas" />

            <div className="max-w-3xl mx-auto pb-12 pt-6">
                <div className="flex items-center gap-4 mb-8 text-slate-800">
                    <Link href={route('kas.masuk.index')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all text-slate-500 dark:text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Catat Pemasukan Kas Baru</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tambahkan data penerimaan uang di luar tagihan siswa reguler</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-5">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-emerald-500" /> Detail Pemasukan
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kategori <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm p-3 shadow-sm transition-colors cursor-pointer focus:ring-emerald-500 focus:border-emerald-500"
                                    value={kategoriId}
                                    onChange={(e) => setKategoriId(e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Kategori --</option>
                                    {kategoriKeuangans.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tanggal Terima <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <CalendarClock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-slate-700 dark:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nominal <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">Rp</span>
                                <input
                                    type="text"
                                    value={nominal ? formatNumber(nominal) : ''}
                                    onChange={handleNominalChange}
                                    placeholder="0"
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-3.5 pl-12 pr-4 text-xl font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Keterangan</label>
                            <textarea
                                rows="3"
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
                                placeholder="Tuliskan detail keterangan transaksi..."
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-3 px-4 text-sm text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 flex items-center gap-3 justify-end">
                        <Link href={route('kas.masuk.index')} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-200 transition-all">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={!kategoriId || !nominal || nominal <= 0 || processing}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${(!kategoriId || !nominal || nominal <= 0 || processing)
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Penerimaan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

KasMasukCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Kas Sekolah', href: '#' },
        { label: 'Kas Masuk', href: route('kas.masuk.index') },
        { label: 'Pencatatan Baru' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
