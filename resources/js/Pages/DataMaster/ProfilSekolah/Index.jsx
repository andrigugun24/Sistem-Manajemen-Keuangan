import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Save, Upload, School } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ProfilSekolahIndex({ profil }) {
    const { flash, sekolah } = usePage().props;
    const logoInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        nama_sekolah: profil?.nama_sekolah || '',
        alamat: profil?.alamat || '',
        telepon: profil?.telepon || '',
        email: profil?.email || '',
        website: profil?.website || '',
        kepala_sekolah: profil?.kepala_sekolah || '',
        nip_kepala_sekolah: profil?.nip_kepala_sekolah || '',
        logo: null,
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profil-sekolah.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const currentLogo = logoPreview || sekolah?.logo_url;

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Profil Yayasan' }]}>
            <Head title="Profil Yayasan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Profil Yayasan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pengaturan Identitas Yayasan</p>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium">
                        ✅ {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Logo Upload */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
                            <div
                                className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 mb-4 overflow-hidden cursor-pointer group relative"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {currentLogo ? (
                                    <img src={currentLogo} alt="Logo Yayasan" className="w-full h-full object-cover" />
                                ) : (
                                    <School className="w-16 h-16 text-white" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-white text-center">{data.nama_sekolah || 'Nama Yayasan'}</h3>

                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                <Upload className="w-4 h-4" />
                                {currentLogo ? 'Ganti Logo' : 'Upload Logo'}
                            </button>
                            {errors.logo && <p className="text-xs text-red-500 mt-2">{errors.logo}</p>}
                            <p className="text-[10px] text-slate-400 mt-2">Maks 2MB • JPG, PNG</p>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Informasi Yayasan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Yayasan</label>
                                    <input type="text" value={data.nama_sekolah} onChange={(e) => setData('nama_sekolah', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                    {errors.nama_sekolah && <p className="text-xs text-red-500 mt-1">{errors.nama_sekolah}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Kepala Yayasan</label>
                                    <input type="text" value={data.kepala_sekolah} onChange={(e) => setData('kepala_sekolah', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">NIP Kepala Yayasan</label>
                                    <input type="text" value={data.nip_kepala_sekolah} onChange={(e) => setData('nip_kepala_sekolah', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Alamat</label>
                                    <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Telepon</label>
                                    <input type="text" value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Website</label>
                                    <input type="text" value={data.website} onChange={(e) => setData('website', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
