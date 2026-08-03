import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import { useState, useEffect } from 'react';

export default function TagihanIndex() {
    const { tagihans = { data: [], links: [] }, stats = {}, tahunAjaranAktif, kategoriTagihans = [], filters = {} } = usePage().props;
    const tagihanData = tagihans.data || [];

    const [filterState, setFilterState] = useState({
        tahun_ajaran: filters.tahun_ajaran || 'all',
        target_kelas: filters.target_kelas || 'semua',
        kategori_tagihan_id: filters.kategori_tagihan_id || 'semua',
        status: filters.status || 'semua',
        search: filters.search || '',
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterState, [key]: value };
        setFilterState(newFilters);

        // Only trigger router for selects immediately. For search, we might want debounce, but let's just do it directly or wait for enter.
        if (key !== 'search') {
            router.get(route('tagihan.index'), newFilters, { preserveState: true, replace: true });
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            router.get(route('tagihan.index'), filterState, { preserveState: true, replace: true });
        }
    };
    const pctTerkumpul = stats.totalExpected > 0 ? Math.round((stats.totalTerkumpul / stats.totalExpected) * 100) : 0;

    return (
        <>
            <Head>
                <title>Tagihan Siswa</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="space-y-6 pb-12">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Tagihan Siswa</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{tahunAjaranAktif ? `Tahun Ajaran ${tahunAjaranAktif.nama_tahun_ajaran}` : 'Tahun Ajaran'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('tagihan.create')} className="flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Buat Tagihan
                        </Link>
                    </div>
                </div>

                {/* Stat Cards - 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Expected (Q1)</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatRp(stats.totalExpected)}</h3>
                            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +5% dari bulan lalu
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                        <div className="w-full">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Sudah Terkumpul</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatRp(stats.totalTerkumpul)}</h3>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pctTerkumpul}%` }}></div>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-green-900/20 rounded-lg text-emerald-600 dark:text-green-400 ml-4">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Belum Dibayar (Tunggakan)</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatRp(stats.totalTunggakan)}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Dari total {stats.jumlahSiswa || 0} Siswa
                            </p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                            {/* Filter Tahun */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Tahun Ajaran</label>
                                <div className="relative">
                                    <select value={filterState.tahun_ajaran} onChange={e => handleFilterChange('tahun_ajaran', e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8">
                                        <option value="all">Semua Tahun</option>
                                        {usePage().props.tahunAjarans?.map(ta => (
                                            <option key={ta.id} value={ta.nama_tahun_ajaran}>{ta.nama_tahun_ajaran}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            {/* Filter Kelas */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Kelas Target</label>
                                <div className="relative">
                                    <select value={filterState.target_kelas} onChange={e => handleFilterChange('target_kelas', e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8">
                                        <option value="semua">Semua Kelas</option>
                                        <option value="79">7-9 (SMP)</option>
                                        <option value="1012">10-12 (SMA)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            {/* Filter Jenis */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Jenis Tagihan</label>
                                <div className="relative">
                                    <select value={filterState.kategori_tagihan_id} onChange={e => handleFilterChange('kategori_tagihan_id', e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8">
                                        <option value="semua">Semua Jenis</option>
                                        {kategoriTagihans.map(k => (
                                            <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            {/* Filter Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Status Progres</label>
                                <div className="relative">
                                    <select value={filterState.status} onChange={e => handleFilterChange('status', e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8">
                                        <option value="semua">Semua Status</option>
                                        <option value="lunas">Lunas 100%</option>
                                        <option value="berjalan">Masih Berjalan</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="w-full md:w-auto flex-shrink-0">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Pencarian</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                                    </div>
                                    <input value={filterState.search} onChange={e => setFilterState({ ...filterState, search: e.target.value })} onKeyDown={handleSearchKeyDown} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 min-w-[200px]" placeholder="Cari Kode... (Enter)" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-surface-dark">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Tagihan Berjalan</h3>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">file_upload</span>
                                Import
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">file_download</span>
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th scope="col" className="p-4 w-4">
                                        <div className="flex items-center">
                                            <input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary" />
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Kode Tagihan</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Jenis Tagihan</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Kelas</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Nominal</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Progres Siswa</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide text-center">Jatuh Tempo</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide">Status</th>
                                    <th scope="col" className="px-6 py-3 font-bold tracking-wide text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {tagihanData.map((row) => {
                                    const totalSiswa = row.totalSiswa ?? row.total_siswa ?? 0;
                                    const sudahBayar = row.sudahBayar ?? row.sudah_bayar ?? 0;
                                    const belumBayar = row.belumBayar ?? row.belum_bayar ?? 0;
                                    const jatuhTempo = row.jatuh_tempo_format ?? row.jatuhTempo ?? row.jatuh_tempo ?? '-';
                                    const pct = totalSiswa > 0 ? Math.round((sudahBayar / totalSiswa) * 100) : 0;
                                    const isLunas = belumBayar === 0;

                                    return (
                                        <tr key={row.id} className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                                {row.kategori_tagihan?.kode_tagihan || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {row.kategori_tagihan?.nama_kategori || '-'}{row.bulan_tagihan ? ` — ${row.bulan_tagihan}` : ''}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {row.target_kelas === 'semua' ? 'Semua Kelas' :
                                                    row.target_kelas === '79' ? 'Kelas 7-9 (SMP)' :
                                                        row.target_kelas === '1012' ? 'Kelas 10-12 (SMA)' :
                                                            'Custom Siswa'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                {formatRp(row.nominal_tagihan)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-emerald-600 font-medium">{sudahBayar} Lunas</span>
                                                        <span className="text-slate-500 dark:text-slate-400">{totalSiswa} Siswa</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                                        <div className={`h-1.5 rounded-full ${pct >= 90 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold whitespace-nowrap">
                                                    {jatuhTempo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isLunas ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                        Lunas Semua
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                                                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                                                        {belumBayar} Belum Lunas
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('tagihan.batch') + `?kategori_tagihan_id=${row.kategori_tagihan_id}&target_kelas=${row.target_kelas}${row.bulan_tagihan ? `&bulan_tagihan=${row.bulan_tagihan}` : ''}`}
                                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="Lihat Siswa Batch Ini"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">group</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Base */}
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                            Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{tagihans.from || 0}-{tagihans.to || 0}</span> dari <span className="font-semibold text-slate-900 dark:text-white">{tagihans.total || 0}</span> batch tagihan
                        </span>
                        <ul className="inline-flex items-center -space-x-px text-sm h-8">
                            {tagihans.links?.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.url || '#'} preserveState dangerouslySetInnerHTML={{ __html: link.label }} className={`flex items-center justify-center px-3 h-8 leading-tight ${link.active ? 'text-white bg-primary border border-primary hover:bg-indigo-700' : 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

TagihanIndex.layout = page => (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Keuangan', href: '#' }, { label: 'Tagihan Siswa' }]}>
        {page}
    </AuthenticatedLayout>
);
