import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable({
    columns = [],
    data = [],
    searchable = true,
    searchPlaceholder = 'Cari data...',
    itemsPerPage = 10,
    actions,
    emptyMessage = 'Tidak ada data ditemukan',
    emptyIcon: EmptyIcon,
}) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    // Filter
    const filtered = data.filter(item =>
        columns.some(col => {
            const val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
            return String(val || '').toLowerCase().includes(search.toLowerCase());
        })
    );

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (!sortField) return 0;
        const col = columns.find(c => c.accessor === sortField);
        const aVal = typeof col?.accessor === 'function' ? col.accessor(a) : a[sortField];
        const bVal = typeof col?.accessor === 'function' ? col.accessor(b) : b[sortField];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginatedData = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (accessor) => {
        if (typeof accessor === 'function') return;
        if (sortField === accessor) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(accessor);
            setSortDir('asc');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
            {/* Header / Search */}
            {searchable && (
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:bg-slate-900 transition-all border border-transparent focus-within:border-indigo-200">
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 w-full"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => col.sortable !== false && handleSort(col.accessor)}
                                    className={`text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500 ${col.sortable !== false && typeof col.accessor !== 'function' ? 'cursor-pointer hover:text-slate-700' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.header}
                                        {sortField === col.accessor && (
                                            sortDir === 'asc'
                                                ? <ChevronUp className="w-3.5 h-3.5" />
                                                : <ChevronDown className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500">
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? paginatedData.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                                        {col.render
                                            ? col.render(row)
                                            : typeof col.accessor === 'function'
                                                ? col.accessor(row)
                                                : row[col.accessor]
                                        }
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-5 py-3.5 text-right">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-16 text-center">
                                    {EmptyIcon && <EmptyIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />}
                                    <p className="text-sm text-slate-400 dark:text-slate-500">{emptyMessage}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                        Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sorted.length)} dari {sorted.length} data
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === page
                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                            : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-900 hover:text-slate-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
