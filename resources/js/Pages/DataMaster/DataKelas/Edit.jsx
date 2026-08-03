import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, GraduationCap, Building2 } from 'lucide-react';

export default function DataKelasEdit({ kelas }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: kelas.nama_kelas || '',
        instansi: kelas.instansi || 'SMP',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('kelas.update', kelas.id));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Edit Data Kelas" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('kelas.index')} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Edit Kelas</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Perbarui informasi ruangan kelas atau instansinya.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nama Kelas */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-slate-400" />
                            Nama Kelas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama_kelas}
                            onChange={e => setData('nama_kelas', e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nama_kelas ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                            placeholder="Contoh: 10 IPA 1"
                        />
                        {errors.nama_kelas && <p className="text-red-500 text-xs mt-1">{errors.nama_kelas}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instansi */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                Instansi Pembinaan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.instansi}
                                onChange={e => setData('instansi', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.instansi ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 cursor-pointer`}
                            >
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                            </select>
                            {errors.instansi && <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('kelas.index')}
                            className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 active:scale-95 disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Perbarui Data'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

DataKelasEdit.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Data Master', href: '#' },
        { label: 'Data Kelas', href: route('kelas.index') },
        { label: 'Edit Data' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
