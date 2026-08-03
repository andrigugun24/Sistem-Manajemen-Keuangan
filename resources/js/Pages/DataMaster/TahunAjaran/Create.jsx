import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Calendar, CheckCircle, HelpCircle } from 'lucide-react';

export default function TahunAjaranCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_tahun_ajaran: '',
        semester: 'Ganjil',
        aktif: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tahun-ajaran.store'));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Tambah Tahun Ajaran Baru" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('tahun-ajaran.index')} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Tambah Tahun Ajaran</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Atur periode akademik sekolah baru beserta semesternya.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tahun Ajaran */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Nama Tahun Ajaran <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama_tahun_ajaran}
                            onChange={e => setData('nama_tahun_ajaran', e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nama_tahun_ajaran ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                            placeholder="Contoh: 2024/2025"
                        />
                        {errors.nama_tahun_ajaran && <p className="text-red-500 text-xs mt-1">{errors.nama_tahun_ajaran}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Semester */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-slate-400" />
                                Semester <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.semester}
                                onChange={e => setData('semester', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.semester ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 cursor-pointer`}
                            >
                                <option value="Ganjil">Ganjil</option>
                                <option value="Genap">Genap</option>
                            </select>
                            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
                        </div>

                        {/* Status Aktif */}
                        <div className="space-y-2 flex flex-col justify-center pt-6">
                            <label className="relative inline-flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={data.aktif}
                                    onChange={e => setData('aktif', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 group-hover:bg-slate-300 peer-checked:group-hover:bg-emerald-600"></div>
                                <span className="ml-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Jadikan Sebagai Tahun Ajaran Aktif</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">Sistem hanya mengizinkan 1 Tahun Ajaran Aktif. Jika Anda mencentang ini, tahun ajaran sebelumnya akan di non-aktifkan otomatis.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('tahun-ajaran.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

TahunAjaranCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Data Master' },
        { label: 'Tahun Ajaran', href: route('tahun-ajaran.index') },
        { label: 'Tambah Baru' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
