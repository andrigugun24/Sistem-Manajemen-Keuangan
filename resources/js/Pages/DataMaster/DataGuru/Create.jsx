import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, User, Hash, Building2, Upload } from 'lucide-react';

export default function DataGuruCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_guru: '',
        nip: '',
        instansi: 'SMP',
        foto: null,
    });

    const fotoInputRef = useRef(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto', file);
            const reader = new FileReader();
            reader.onload = (ev) => setFotoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('guru.store'), { forceFormData: true });
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-display antialiased pb-10">
            <Head title="Tambah Data Guru Baru" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('guru.index')} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Tambah Guru/Staf</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base ml-7">Masukkan identitas guru atau staf baru beserta instansi tempatnya mengajar.</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nama Guru */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama_guru}
                            onChange={e => setData('nama_guru', e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nama_guru ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                            placeholder="Contoh: Budi Santoso, S.Pd"
                        />
                        {errors.nama_guru && <p className="text-red-500 text-xs mt-1">{errors.nama_guru}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NIP (Nomor Induk Pegawai) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-400" />
                                NIP / NIK <span className="text-slate-400 text-xs font-normal">(Opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={data.nip}
                                onChange={e => setData('nip', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.nip ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4`}
                                placeholder="Masukkan NIP atau kosongkan jika tidak ada"
                            />
                            {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                        </div>

                        {/* Instansi */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                Instansi <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.instansi}
                                onChange={e => setData('instansi', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${errors.instansi ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500/50'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-all focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 cursor-pointer`}
                            >
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="Keduanya/Yayasan">Keduanya/Yayasan</option>
                            </select>
                            {errors.instansi && <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>}
                        </div>
                    </div>

                    {/* Foto Guru */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-slate-400" />
                            Foto Guru <span className="text-slate-400 text-xs font-normal">(Opsional)</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                                onClick={() => fotoInputRef.current?.click()}
                            >
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <input ref={fotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                                <button type="button" onClick={() => fotoInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                    <Upload className="w-4 h-4" />
                                    Pilih Foto
                                </button>
                                <p className="text-xs text-slate-400 mt-1.5">Maks 2MB • JPG, PNG</p>
                                {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('guru.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Data Guru'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

DataGuruCreate.layout = page => (
    <AuthenticatedLayout breadcrumbs={[
        { label: 'Data Master', href: '#' },
        { label: 'Guru & Staf', href: route('guru.index') },
        { label: 'Tambah Baru' }
    ]}>
        {page}
    </AuthenticatedLayout>
);
