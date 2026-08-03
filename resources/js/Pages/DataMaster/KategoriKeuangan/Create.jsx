import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, FolderPlus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function KategoriKeuanganCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_kategori: '',
        jenis: 'Pemasukan',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('kategori-keuangan.store'));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Tambah Kategori Keuangan" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('kategori-keuangan.index')} className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Tambah Kategori Keuangan</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Klasifikasi sumber pendanaan (masuk) atau pos beban pendanaan (keluar) yayasan.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Jenis Aliran Dana */}
                        <div className="space-y-2 md:col-span-2 border-b border-slate-100 dark:border-slate-800 pb-6 mb-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Jenis Aliran Dana <span className="text-red-500">*</span></label>

                            <div className="grid grid-cols-2 gap-4">
                                <label className={`
                                    relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all
                                    ${data.jenis === 'Pemasukan' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 bg-white dark:bg-slate-900'}
                                `}>
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="Pemasukan"
                                        checked={data.jenis === 'Pemasukan'}
                                        onChange={(e) => setData('jenis', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${data.jenis === 'Pemasukan' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <ArrowDownCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${data.jenis === 'Pemasukan' ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-300'}`}>Pemasukan (Kas Masuk)</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sumber dana yang diterima sekolah</p>
                                    </div>

                                    {/* Indicator */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.jenis === 'Pemasukan' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                            {data.jenis === 'Pemasukan' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                        </div>
                                    </div>
                                </label>

                                <label className={`
                                    relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all
                                    ${data.jenis === 'Pengeluaran' ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 hover:border-red-200 bg-white dark:bg-slate-900'}
                                `}>
                                    <input
                                        type="radio"
                                        name="jenis"
                                        value="Pengeluaran"
                                        checked={data.jenis === 'Pengeluaran'}
                                        onChange={(e) => setData('jenis', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${data.jenis === 'Pengeluaran' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <ArrowUpCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${data.jenis === 'Pengeluaran' ? 'text-red-700' : 'text-slate-700 dark:text-slate-300'}`}>Pengeluaran (Kas Keluar)</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pos beban pembiayaan sekolah</p>
                                    </div>

                                    {/* Indicator */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.jenis === 'Pengeluaran' ? 'border-red-500' : 'border-slate-300'}`}>
                                            {data.jenis === 'Pengeluaran' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Nama Kategori */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <FolderPlus className="w-4 h-4 text-slate-400" />
                                Nama Kategori <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_kategori}
                                onChange={e => setData('nama_kategori', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nama_kategori ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder={data.jenis === 'Pemasukan' ? "Contoh: Dana BOS" : "Contoh: Gaji Guru & Staf"}
                            />
                            {errors.nama_kategori && <p className="text-red-500 text-xs mt-1">{errors.nama_kategori}</p>}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Berikan nama yang singkat dan jelas untuk mempermudah identifikasi saat transaksi keuangan.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('kategori-keuangan.index')}
                            className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all shadow-sm active:scale-95 disabled:opacity-70
                                ${data.jenis === 'Pemasukan' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}
                            `}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

KategoriKeuanganCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Data Master', href: '#' },
        { label: 'Kategori Keuangan', href: route('kategori-keuangan.index') },
        { label: 'Tambah Baru' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
