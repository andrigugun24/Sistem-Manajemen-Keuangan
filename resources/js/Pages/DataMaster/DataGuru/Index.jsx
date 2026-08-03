import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function DataGuruIndex({ gurus = [] }) {
    const { userRole } = usePage().props;
    const canEdit = !['kepala_sekolah', 'kepala_yayasan'].includes(userRole);

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('guru.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus data Guru/Staf ini?');
    };

    const columns = [
        { header: 'NIP', accessor: 'nip' },
        {
            header: 'Nama',
            accessor: 'nama_guru',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{row.nama_guru.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{row.nama_guru}</span>
                </div>
            )
        },
        { header: 'Instansi', accessor: 'instansi' },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => <Badge variant="success" dot>Aktif</Badge>
        },
    ];

    return (
        <div className="space-y-6 pb-12 font-display antialiased">
            <Head title="Data Guru & Staf" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Guru & Staf</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{canEdit ? 'Database pegawai sekolah' : 'Lihat data pegawai sekolah'}</p>
                </div>
                {canEdit && (
                    <Link href={route('guru.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" /> Tambah Guru/Staf
                    </Link>
                )}
            </div>
            <DataTable columns={columns} data={gurus} searchPlaceholder="Cari nama atau NIP guru..." emptyIcon={Users}
                actions={canEdit ? (row) => (
                    <div className="flex items-center gap-1 justify-end">
                        <Link href={route('guru.edit', row.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit Data"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Hapus Data"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ) : undefined}
            />
        </div>
    );
}

DataGuruIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Data Master', href: '#' }, { label: 'Guru & Staf' }]}>
        {page}
    </AuthenticatedLayout>
);
