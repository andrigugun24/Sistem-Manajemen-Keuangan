import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function DataSiswaCreate({ kelas = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nisn: '',
        nama_lengkap: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'L',
        agama: '',
        alamat: '',
        kelas_id: '',
        instansi: 'SMP',
        nama_ayah: '',
        nama_ibu: '',
        telepon_ortu: '',
        pekerjaan_ortu: '',
        foto: null,
    });

    const fotoInputRef = useRef(null);
    const [fotoPreview, setFotoPreview] = useState(null);

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
        post(route('siswa.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout

            breadcrumbs={[
                { label: 'Data Master', href: '#' },
                { label: 'Data Siswa', href: route('siswa.index') },
                { label: 'Tambah Siswa' }
            ]}
        >
            <Head title="Tambah Siswa" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('siswa.index')} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:border-slate-300 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Tambah Siswa Baru</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lengkapi data siswa di bawah ini</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Pribadi */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Data Pribadi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">NISN <span className="text-red-500">*</span></label>
                                <input type="text" name="nisn" value={data.nisn} onChange={handleChange} placeholder="Masukkan NISN" className={`w-full px-4 py-2.5 rounded-xl border ${errors.nisn ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input type="text" name="nama_lengkap" value={data.nama_lengkap} onChange={handleChange} placeholder="Masukkan nama lengkap" className={`w-full px-4 py-2.5 rounded-xl border ${errors.nama_lengkap ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tempat Lahir</label>
                                <input type="text" name="tempat_lahir" value={data.tempat_lahir} onChange={handleChange} placeholder="Masukkan tempat lahir" className={`w-full px-4 py-2.5 rounded-xl border ${errors.tempat_lahir ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.tempat_lahir && <p className="text-red-500 text-xs mt-1">{errors.tempat_lahir}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tanggal Lahir</label>
                                <input type="date" name="tanggal_lahir" value={data.tanggal_lahir} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.tanggal_lahir ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                                <select name="jenis_kelamin" value={data.jenis_kelamin} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.jenis_kelamin ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white dark:bg-slate-900`}>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Kelas <span className="text-red-500">*</span></label>
                                <select name="kelas_id" value={data.kelas_id} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.kelas_id ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white dark:bg-slate-900`}>
                                    <option value="">Pilih kelas</option>
                                    {kelas.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama_kelas} ({k.instansi})</option>
                                    ))}
                                </select>
                                {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Instansi <span className="text-red-500">*</span></label>
                                <select name="instansi" value={data.instansi} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${errors.instansi ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white dark:bg-slate-900`}>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                                {errors.instansi && <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Alamat</label>
                                <textarea name="alamat" value={data.alamat} onChange={handleChange} rows="3" placeholder="Masukkan alamat lengkap" className={`w-full px-4 py-2.5 rounded-xl border ${errors.alamat ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none`} />
                                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Foto Siswa */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Foto Siswa</h3>
                        <div className="flex items-center gap-6">
                            <div
                                className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
                                onClick={() => fotoInputRef.current?.click()}
                            >
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-8 h-8 text-slate-400" />
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

                    {/* Data Orang Tua */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Data Orang Tua / Wali</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Ayah</label>
                                <input type="text" name="nama_ayah" value={data.nama_ayah} onChange={handleChange} placeholder="Masukkan nama ayah" className={`w-full px-4 py-2.5 rounded-xl border ${errors.nama_ayah ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nama_ayah && <p className="text-red-500 text-xs mt-1">{errors.nama_ayah}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Ibu</label>
                                <input type="text" name="nama_ibu" value={data.nama_ibu} onChange={handleChange} placeholder="Masukkan nama ibu" className={`w-full px-4 py-2.5 rounded-xl border ${errors.nama_ibu ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.nama_ibu && <p className="text-red-500 text-xs mt-1">{errors.nama_ibu}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">No. Telepon Orang Tua</label>
                                <input type="text" name="telepon_ortu" value={data.telepon_ortu} onChange={handleChange} placeholder="08xxxxxxxxxx" className={`w-full px-4 py-2.5 rounded-xl border ${errors.telepon_ortu ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.telepon_ortu && <p className="text-red-500 text-xs mt-1">{errors.telepon_ortu}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Pekerjaan Orang Tua</label>
                                <input type="text" name="pekerjaan_ortu" value={data.pekerjaan_ortu} onChange={handleChange} placeholder="Masukkan pekerjaan" className={`w-full px-4 py-2.5 rounded-xl border ${errors.pekerjaan_ortu ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm`} />
                                {errors.pekerjaan_ortu && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan_ortu}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('siswa.index')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:bg-slate-800/50 transition-all">
                            Batal
                        </Link>
                        <button disabled={processing} type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
