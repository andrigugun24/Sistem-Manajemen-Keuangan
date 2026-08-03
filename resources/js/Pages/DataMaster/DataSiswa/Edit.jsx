import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function DataSiswaEdit({ siswa, kelas = [] }) {
    const { data, setData, processing, errors } = useForm({
        nisn: siswa.nisn || '',
        nama_lengkap: siswa.nama_lengkap || '',
        tempat_lahir: siswa.tempat_lahir || '',
        tanggal_lahir: siswa.tanggal_lahir || '',
        jenis_kelamin: siswa.jenis_kelamin || 'L',
        agama: siswa.agama || '',
        alamat: siswa.alamat || '',
        kelas_id: siswa.kelas_id || '',
        instansi: siswa.instansi || 'SMP',
        nama_ayah: siswa.nama_ayah || '',
        nama_ibu: siswa.nama_ibu || '',
        telepon_ortu: siswa.telepon_ortu || '',
        pekerjaan_ortu: siswa.pekerjaan_ortu || '',
        status: siswa.status || 'aktif',
        foto: null,
    });

    const fotoInputRef = useRef(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const currentFoto = fotoPreview || (siswa.foto ? `/storage/${siswa.foto}` : null);

    const handleChange = (e) => setData(e.target.name, e.target.value);

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
        router.post(route('siswa.update', siswa.id), {
            _method: 'put',
            ...data,
        }, { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Data Master', href: '#' },
                { label: 'Data Siswa', href: route('siswa.index') },
                { label: 'Edit Siswa' }
            ]}
        >
            <Head title="Edit Siswa" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('siswa.index')} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Data Siswa</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Perbarui data siswa di bawah ini</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Pribadi */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Data Pribadi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">NISN <span className="text-red-500">*</span></label>
                                <input type="text" name="nisn" value={data.nisn} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.nisn ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input type="text" name="nama_lengkap" value={data.nama_lengkap} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.nama_lengkap ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tempat Lahir</label>
                                <input type="text" name="tempat_lahir" value={data.tempat_lahir} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tanggal Lahir</label>
                                <input type="date" name="tanggal_lahir" value={data.tanggal_lahir} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                                <select name="jenis_kelamin" value={data.jenis_kelamin} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white">
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Kelas <span className="text-red-500">*</span></label>
                                <select name="kelas_id" value={data.kelas_id} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.kelas_id ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white`}>
                                    <option value="">Pilih kelas</option>
                                    {kelas.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama_kelas} ({k.instansi})</option>
                                    ))}
                                </select>
                                {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Instansi <span className="text-red-500">*</span></label>
                                <select name="instansi" value={data.instansi} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white">
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                                <select name="status" value={data.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white">
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                    <option value="lulus">Lulus</option>
                                    <option value="pindah">Pindah</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Alamat</label>
                                <textarea name="alamat" value={data.alamat} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* Foto Siswa */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Foto Siswa</h3>
                        <div className="flex items-center gap-6">
                            <div
                                className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
                                onClick={() => fotoInputRef.current?.click()}
                            >
                                {currentFoto ? (
                                    <img src={currentFoto} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-8 h-8 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <input ref={fotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                                <button type="button" onClick={() => fotoInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                    <Upload className="w-4 h-4" />
                                    {currentFoto ? 'Ganti Foto' : 'Pilih Foto'}
                                </button>
                                <p className="text-xs text-slate-400 mt-1.5">Maks 2MB • JPG, PNG</p>
                                {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Data Orang Tua */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Data Orang Tua / Wali</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Ayah</label>
                                <input type="text" name="nama_ayah" value={data.nama_ayah} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Ibu</label>
                                <input type="text" name="nama_ibu" value={data.nama_ibu} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">No. Telepon Orang Tua</label>
                                <input type="text" name="telepon_ortu" value={data.telepon_ortu} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Pekerjaan Orang Tua</label>
                                <input type="text" name="pekerjaan_ortu" value={data.pekerjaan_ortu} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('siswa.index')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 transition-all">
                            Batal
                        </Link>
                        <button disabled={processing} type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Perbarui Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
