import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
const ChickenBank = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <circle cx="12" cy="4" r="2" />
        <path d="M12 7v1" />
        <path d="M19 12c0-3.5-3-6-7-6S5 8.5 5 12c0 2 1 3 2.5 4H16c2 0 3-1.5 3-4z" />
        <path d="M10 6c-1-2-3-1-3-1s1 2 0 3" />
        <path d="M19 11l3-1-2 3" />
        <circle cx="16" cy="11" r="1" fill="currentColor" />
        <path d="M9 16v3" />
        <path d="M14 16v3" />
        <path d="M8 19h2" />
        <path d="M13 19h2" />
    </svg>
);
import { formatRp, formatNumber } from '@/utils/formatRupiah';

export default function TabunganIndex() {
    const { tabungans = { data: [] }, stats = {} } = usePage().props;
    const tabunganData = tabungans.data || [];

    const columns = [
        { header: 'NISN', accessor: 'nisn', render: (row) => row.siswa?.nisn || '-' },
        {
            header: 'Nama Siswa', accessor: 'nama', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{(row.siswa?.nama_lengkap || '?').charAt(0)}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{row.siswa?.nama_lengkap || '-'}</span>
                </div>
            )
        },
        { header: 'Kelas', accessor: 'kelas', render: (row) => row.siswa?.kelas?.nama_kelas || '-' },
        { header: 'Saldo', accessor: 'saldo', render: (row) => <span className="font-bold text-emerald-600">Rp {formatNumber((row.saldo || 0))}</span> },
        { header: 'Transaksi Terakhir', accessor: 'updated_at', render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' },
    ];

    return (
        <>
            <Head title="Data Tabungan Siswa" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Data Tabungan Siswa</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola tabungan mandiri siswa</p>
                    </div>
                </div>
                <DataTable columns={columns} data={tabunganData} searchPlaceholder="Cari siswa..." emptyIcon={ChickenBank}
                    actions={(row) => (
                        <Link href={route('tabungan.buku', { siswa: row.siswa_id })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all">
                            Lihat Mutasi
                        </Link>
                    )}
                />
            </div>
        </>
    );
}

TabunganIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Tabungan Siswa', href: '/tabungan' }, { label: 'Dashboard' }]}>
        {page}
    </AuthenticatedLayout>
);
