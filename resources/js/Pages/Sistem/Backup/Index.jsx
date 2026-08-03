import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Shield, Info, Download, CloudUpload, AlertTriangle, UploadCloud, RefreshCcw, FileText, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function BackupIndex({ backups }) {
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [restoreFile, setRestoreFile] = useState(null);
    const [restoreLoading, setRestoreLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleCreateBackup = () => {
        setLoading(true);
        router.post(route('backup.create'), {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleDownload = (filename) => {
        window.location.href = route('backup.download', filename);
    };

    const handleDelete = (filename) => {
        confirmDelete(() => {
            router.delete(route('backup.destroy', filename), {
                preserveScroll: true,
            });
        }, 'Yakin ingin menghapus backup ini?');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setRestoreFile(file || null);
    };

    const handleRestore = () => {
        if (!restoreFile) return;
        confirmDelete(() => {
            setRestoreLoading(true);
            const formData = new FormData();
            formData.append('backup_file', restoreFile);

            router.post(route('backup.restore'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => {
                    setRestoreLoading(false);
                    setRestoreFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
            });
        }, 'PERHATIAN: Proses restore akan menimpa seluruh data yang ada. Lanjutkan?', 'Konfirmasi Restore', 'Ya, Restore!');
    };

    return (
        <div className="flex flex-1 flex-col font-display pb-10">
            <Head title="Backup & Restore" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{flash.error}</p>
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Operasi Database</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-sm md:text-base">
                    Kelola pencadangan dan pemulihan data sistem. Pastikan untuk melakukan backup secara berkala.
                </p>
            </div>

            {/* Split Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Backup Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Backup Data</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Amankan data sistem ke penyimpanan lokal</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col gap-6 flex-1">
                        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-800 dark:text-white">Informasi</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Backup akan mengekspor seluruh database MySQL ke file .zip. Total backup tersimpan: <span className="font-mono font-medium text-slate-900 dark:text-white">{backups.length} file</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button
                            onClick={handleCreateBackup}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Memproses Backup...</>
                            ) : (
                                <><Download className="w-5 h-5" /> Buat Backup Baru</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Restore Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50 dark:from-orange-900/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
                                <CloudUpload className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Restore Data</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pulihkan sistem dari file cadangan</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col gap-6 flex-1">
                        <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200/60 dark:border-orange-800/30 text-orange-800 dark:text-orange-300">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold">PERHATIAN PENTING</span>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    Proses ini akan <span className="font-bold underline">menimpa seluruh data</span> yang ada saat ini. Pastikan Anda telah melakukan backup sebelum restore.
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <label htmlFor="file-upload" className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${restoreFile ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-600'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className={`mb-3 p-3 rounded-full transition-colors ${restoreFile ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary'}`}>
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    {restoreFile ? (
                                        <>
                                            <p className="mb-1 text-sm font-bold text-primary">{restoreFile.name}</p>
                                            <p className="text-xs text-slate-400">{(restoreFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300">Klik untuk upload</span> atau tarik file ke sini</p>
                                            <p className="text-xs text-slate-400">File yang didukung: .SQL, .ZIP (Max 500MB)</p>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} id="file-upload" type="file" className="hidden" accept=".sql,.zip" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button
                            onClick={handleRestore}
                            disabled={!restoreFile || restoreLoading}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 font-bold rounded-lg transition-all ${restoreFile && !restoreLoading
                                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 active:scale-[0.98]'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {restoreLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Memproses Restore...</>
                            ) : (
                                <><RefreshCcw className="w-5 h-5" /> Mulai Restore</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Backup</h2>
                    <button onClick={() => router.reload()} className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4">Nama File</th>
                                    <th className="px-6 py-4">Ukuran</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {backups.length > 0 ? backups.map((backup) => (
                                    <tr key={backup.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{backup.tanggal}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-slate-400 w-5 h-5" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">{backup.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            {backup.ukuran}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                {backup.jenis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Sukses
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleDownload(backup.nama)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(backup.nama)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada riwayat backup</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Buat backup pertama dengan menekan tombol di atas</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

BackupIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Pengaturan', href: '#' }, { label: 'Backup & Restore' }]}>
        {page}
    </AuthenticatedLayout>
);
