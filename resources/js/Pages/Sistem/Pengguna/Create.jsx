import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, User, Mail, Lock, Shield, Users } from 'lucide-react';

export default function PenggunaCreate({ siswas = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'guru',
        instansi: '',
        siswa_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengguna.store'));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Tambah Pengguna Baru" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('pengguna.index')} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Tambah Pengguna</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Masukkan informasi detail untuk menambahkan pengguna baru ke sistem.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nama Lengkap */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                            placeholder="Masukkan nama lengkap pengguna"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Alamat Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                            placeholder="nama@sekolah.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Peran / Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-slate-400" />
                                Peran (Role) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.role ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 cursor-pointer`}
                            >
                                <option value="admin">Admin</option>
                                <option value="bendahara">Bendahara</option>
                                <option value="kepala_sekolah">Kepala Sekolah</option>
                                <option value="kepala_yayasan">Kepala Yayasan</option>
                                <option value="guru">Guru</option>
                                <option value="orang_tua">Orang Tua</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-400" />
                                Password Akses <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Instansi khusus Kepala Sekolah */}
                        {data.role === 'kepala_sekolah' && (
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    Instansi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.instansi}
                                    onChange={e => setData('instansi', e.target.value)}
                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.instansi ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 cursor-pointer`}
                                >
                                    <option value="">-- Pilih Instansi --</option>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                                <p className="text-xs text-slate-400">Kepala sekolah hanya dapat melihat data siswa & guru pada instansi yang dipilih.</p>
                                {errors.instansi && <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>}
                            </div>
                        )}

                        {/* Pilihan Siswa khusus Orang Tua */}
                        {data.role === 'orang_tua' && siswas && siswas.length > 0 && (
                            <div className="md:col-span-2 space-y-3 mt-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    Pilih Anak (Siswa Terkait)
                                </label>
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {siswas.map((siswa) => (
                                        <label key={siswa.id} className="flex items-center gap-3 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={data.siswa_ids.includes(siswa.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('siswa_ids', [...data.siswa_ids, siswa.id]);
                                                    } else {
                                                        setData('siswa_ids', data.siswa_ids.filter(id => id !== siswa.id));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                                    {siswa.nama_lengkap}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    NISN: {siswa.nisn}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.siswa_ids && <p className="text-red-500 text-xs mt-1">{errors.siswa_ids}</p>}
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('pengguna.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

PenggunaCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Dashboard', href: '#' },
        { label: 'Manajemen Pengguna', href: route('pengguna.index') },
        { label: 'Tambah Pengguna' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
