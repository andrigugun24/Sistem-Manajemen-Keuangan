import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { Search, Users, X, Check, Plus, ChevronLeft, ChevronRight, Trash2, Pencil, Upload } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';
import Modal from '@/Components/Modal';

export default function DataSiswaIndex() {
    const { siswas = {}, filters = {}, auth } = usePage().props;
    const userRole = auth?.user?.role;
    const canEdit = !['kepala_sekolah', 'kepala_yayasan'].includes(userRole);

    const siswaList = siswas.data || [];

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [activeTab, setActiveTab] = useState('Data Siswa');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, errors: importErrors, reset: resetImport } = useForm({
        file: null,
    });
    const fileInputRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('siswa.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('siswa.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus data siswa ini?');
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        postImport(route('siswa.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport();
            },
        });
    };

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=4f46e5&size=64`;

    return (
        <div className="h-full flex flex-col font-display antialiased pb-4">
            <Head title="Data Siswa & Orang Tua" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{canEdit ? 'Master Data Siswa & Orang Tua' : 'Data Siswa & Orang Tua'}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{canEdit ? 'Kelola data siswa, orang tua, dan status akademik.' : 'Lihat data siswa, orang tua, dan status akademik.'}</p>
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        <button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            <Upload className="w-4 h-4" /> Import Excel
                        </button>
                        <Link href={route('siswa.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            <Plus className="w-4 h-4" /> Tambah Siswa
                        </Link>
                    </div>
                )}
            </div>

            <Modal show={isImportModalOpen} onClose={() => { setIsImportModalOpen(false); resetImport(); }} maxWidth="md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Import Data Siswa</h2>
                        <button onClick={() => { setIsImportModalOpen(false); resetImport(); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleImportSubmit}>
                        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                            Unggah file Excel (.xlsx, .xls) yang berisi data siswa. Pastikan format kolom sesuai dengan template standar sistem.
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">File Excel</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".xlsx, .xls, .csv"
                                onChange={e => setImportData('file', e.target.files[0])}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400 transition-colors cursor-pointer"
                            />
                            {importErrors.file && <div className="text-red-500 text-xs mt-1">{importErrors.file}</div>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => { setIsImportModalOpen(false); resetImport(); }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-colors"
                                disabled={importProcessing}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={importProcessing || !importData.file}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {importProcessing ? 'Mengimport...' : 'Import Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0 relative">
                <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${selectedSiswa ? 'lg:border-r border-slate-200 dark:border-slate-800 lg:pr-6' : ''}`}>
                    <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-1.5 shadow-sm mb-4">
                        <div className="flex items-center px-3 py-1.5 gap-2">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari nama siswa atau NISN..." className="border-none w-full bg-transparent focus:ring-0 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
                        </div>
                    </form>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 w-10"></th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Siswa</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">NISN</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Kelas</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Orang Tua</th>
                                    {canEdit && <th className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-20">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {siswaList.length > 0 ? siswaList.map((row) => {
                                    const isSelected = selectedSiswa?.id === row.id;
                                    return (
                                        <tr key={row.id} onClick={() => setSelectedSiswa(row)} className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-500/10' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'}`}>
                                            <td className="px-5 py-4">
                                                {isSelected ? (
                                                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0"><Check className="w-3.5 h-3.5" strokeWidth={3} /></div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0"></div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <img src={getAvatar(row.nama_lengkap)} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-700" />
                                                    <span className="font-semibold text-slate-800 dark:text-white text-sm">{row.nama_lengkap}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.nisn}</td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{row.kelas?.nama_kelas || '-'}</span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium text-slate-800 dark:text-white">{row.nama_ayah || row.nama_ibu || '-'}</p>
                                                {row.telepon_ortu && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">📞 {row.telepon_ortu}</p>}
                                            </td>
                                            {canEdit && (
                                                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex gap-1">
                                                        <Link href={route('siswa.edit', row.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"><Pencil className="w-4 h-4" /></Link>
                                                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={canEdit ? 6 : 5} className="px-5 py-12 text-center">
                                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-semibold text-slate-500">Belum ada data siswa</p>
                                        <p className="text-sm text-slate-400 mt-1">Klik "Tambah Siswa" untuk menambah data.</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>

                        {siswas.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                                <span>Menampilkan <strong>{siswas.from}-{siswas.to}</strong> dari <strong>{siswas.total}</strong></span>
                                <div className="flex gap-1">
                                    {siswas.prev_page_url && <Link href={siswas.prev_page_url} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" /> Prev</Link>}
                                    {siswas.next_page_url && <Link href={siswas.next_page_url} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1 text-sm">Next <ChevronRight className="w-4 h-4" /></Link>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {selectedSiswa && (
                    <div className="w-full lg:w-[400px] xl:w-[450px] lg:pl-6 pt-6 lg:pt-0 shrink-0 flex flex-col h-full bg-[#fafafa] dark:bg-transparent">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Detail Siswa</h3>
                            <button onClick={() => setSelectedSiswa(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={getAvatar(selectedSiswa.nama_lengkap)} alt="" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSiswa.nama_lengkap}</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">{selectedSiswa.kelas?.nama_kelas || '-'} &bull; NISN: {selectedSiswa.nisn}</p>
                                    <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${selectedSiswa.status === 'aktif' || !selectedSiswa.status ? 'bg-emerald-100/50 text-emerald-600' : 'bg-amber-100/50 text-amber-600'}`}>{selectedSiswa.status || 'aktif'}</div>
                                </div>
                            </div>
                            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-6">
                                {['Data Siswa', 'Orang Tua'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-semibold border-b-2 ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{tab}</button>
                                ))}
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-4">
                                {activeTab === 'Data Siswa' && (
                                    <div className="space-y-4">
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Tempat, Tanggal Lahir</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.tempat_lahir || '-'}, {selectedSiswa.tanggal_lahir ? new Date(selectedSiswa.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</p></div>
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Jenis Kelamin</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p></div>
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Instansi</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.instansi || '-'}</p></div>
                                        {selectedSiswa.alamat && <div><p className="text-[13px] text-slate-500 mb-0.5">Alamat</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.alamat}</p></div>}
                                    </div>
                                )}
                                {activeTab === 'Orang Tua' && (
                                    <div className="space-y-4">
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Nama Ayah</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.nama_ayah || '-'}</p></div>
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Nama Ibu</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.nama_ibu || '-'}</p></div>
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Telepon</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.telepon_ortu || '-'}</p></div>
                                        <div><p className="text-[13px] text-slate-500 mb-0.5">Pekerjaan</p><p className="text-sm font-medium text-slate-900 dark:text-white">{selectedSiswa.pekerjaan_ortu || '-'}</p></div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
                                <Link
                                    href={route('tagihan.show', selectedSiswa.id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                    Lihat Riwayat Tagihan
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

DataSiswaIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Data Siswa' }]}>
        {page}
    </AuthenticatedLayout>
);
