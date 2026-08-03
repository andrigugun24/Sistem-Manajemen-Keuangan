import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Tag, AlignLeft, Calculator, CalendarDays, Receipt } from 'lucide-react';

export default function KategoriTagihanEdit({ kategori_tagihan }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori_tagihan.nama_kategori || '',
        kode_tagihan: kategori_tagihan.kode_tagihan || '',
        jenis_tagihan: kategori_tagihan.jenis_tagihan || 'Bulanan',
        nominal_default: kategori_tagihan.nominal_default || '',
        deskripsi: kategori_tagihan.deskripsi || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('kategori-tagihan.update', kategori_tagihan.id));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Edit Kategori Tagihan" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('kategori-tagihan.index')} className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Edit Kategori Tagihan</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Perbarui detail acuan pencatatan dan penagihan keuangan siswa.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Jenis Tagihan - Radio Option Cards (DISABLED for Safety) */}
                    <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Siklus Penagihan <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`
                                relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all opacity-70 pointer-events-none
                                ${data.jenis_tagihan === 'Bulanan' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 bg-white dark:bg-slate-900'}
                            `}>
                                <input
                                    type="radio"
                                    value="Bulanan"
                                    checked={data.jenis_tagihan === 'Bulanan'}
                                    onChange={(e) => setData('jenis_tagihan', e.target.value)}
                                    className="sr-only"
                                    disabled
                                />
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 shrink-0 ${data.jenis_tagihan === 'Bulanan' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <CalendarDays className="w-4 h-4" />
                                </div>
                                <div className="pr-6">
                                    <p className={`font-bold text-sm ${data.jenis_tagihan === 'Bulanan' ? 'text-indigo-700' : 'text-slate-700 dark:text-slate-300'}`}>Rutin Bulanan</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Dikenakan setiap bulan per tahun ajaran. Cocok untuk SPP/Infaq Syahriah.</p>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.jenis_tagihan === 'Bulanan' ? 'border-indigo-500' : 'border-slate-300'}`}>
                                        {data.jenis_tagihan === 'Bulanan' && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                    </div>
                                </div>
                            </label>

                            <label className={`
                                relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all opacity-70 pointer-events-none
                                ${data.jenis_tagihan === 'Sekali Bayar' ? 'border-purple-500 bg-purple-50/50' : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 bg-white dark:bg-slate-900'}
                            `}>
                                <input
                                    type="radio"
                                    value="Sekali Bayar"
                                    checked={data.jenis_tagihan === 'Sekali Bayar'}
                                    onChange={(e) => setData('jenis_tagihan', e.target.value)}
                                    className="sr-only"
                                    disabled
                                />
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 shrink-0 ${data.jenis_tagihan === 'Sekali Bayar' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <Receipt className="w-4 h-4" />
                                </div>
                                <div className="pr-6">
                                    <p className={`font-bold text-sm ${data.jenis_tagihan === 'Sekali Bayar' ? 'text-purple-700' : 'text-slate-700 dark:text-slate-300'}`}>Insidental / 1x</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Hanya dikenakan sesekali / sekali saja. Misal: Uang Gedung, Seragam.</p>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.jenis_tagihan === 'Sekali Bayar' ? 'border-purple-500' : 'border-slate-300'}`}>
                                        {data.jenis_tagihan === 'Sekali Bayar' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <p className="text-xs text-amber-600 mt-2 font-medium">ⓘ Siklus penagihan tidak bisa diubah karena sangat terkait dengan struktur data operasional.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Nama Kategori */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-slate-400" />
                                Nama Tagihan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_kategori}
                                onChange={e => setData('nama_kategori', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nama_kategori ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder="Contoh: Infaq Syahriah Bulanan"
                            />
                            {errors.nama_kategori && <p className="text-red-500 text-xs mt-1">{errors.nama_kategori}</p>}
                        </div>

                        {/* Kode Tagihan */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                Kode (Opsional)
                            </label>
                            <input
                                type="text"
                                value={data.kode_tagihan}
                                onChange={e => setData('kode_tagihan', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.kode_tagihan ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500/50'} rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder="Cth: INFAQ-01"
                            />
                            {errors.kode_tagihan && <p className="text-red-500 text-xs mt-1">{errors.kode_tagihan}</p>}
                        </div>

                        {/* Nominal Default */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-slate-400" />
                                Nominal Default <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-sm font-medium text-slate-500 dark:text-slate-400">Rp</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.nominal_default}
                                    onChange={e => setData('nominal_default', e.target.value)}
                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nominal_default ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500/50'} rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                    placeholder="0"
                                />
                            </div>
                            {errors.nominal_default && <p className="text-red-500 text-xs mt-1">{errors.nominal_default}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-slate-400" />
                                Deskripsi <span className="text-xs text-slate-400 font-normal">(Opsional)</span>
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.deskripsi ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder="Beri keterangan ringkas (maks 255 karakter)"
                                rows="3"
                            ></textarea>
                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('kategori-tagihan.index')}
                            className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all shadow-sm active:scale-95 disabled:opacity-70 ${data.jenis_tagihan === 'Bulanan' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'} `}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyesuaikan...' : 'Perbarui Kategori Tagihan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

KategoriTagihanEdit.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Data Master', href: '#' },
        { label: 'Kategori Tagihan', href: route('kategori-tagihan.index') },
        { label: 'Edit Kategori' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
