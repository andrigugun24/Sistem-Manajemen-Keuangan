import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, Users, GraduationCap, Building2, Wallet,
    Receipt, BookOpen, FileText, BarChart3, Settings,
    Shield, Bell, ChevronDown, School, UserCog, FolderOpen,
    CreditCard, ArrowDownCircle, ArrowUpCircle, DollarSign,
    PieChart, Activity, HardDrive, User, X
} from 'lucide-react';

// Custom Icon Celengan Ayam
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

const menuConfig = {
    admin: [
        { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
        {
            label: 'Data Master', icon: FolderOpen, children: [
                { label: 'Data Siswa', routeName: 'siswa.index' },
                { label: 'Data Kelas', routeName: 'kelas.index' },
                { label: 'Guru & Staf', routeName: 'guru.index' },
                { label: 'Manajemen Pengguna', routeName: 'pengguna.index' },
                { label: 'Tahun Ajaran', routeName: 'tahun-ajaran.index' },
                { label: 'Kategori Keuangan', routeName: 'kategori-keuangan.index' },
                { label: 'Kategori Tagihan', routeName: 'kategori-tagihan.index' },
                { label: 'Profil Yayasan', routeName: 'profil-sekolah.index' },
            ]
        },
        {
            label: 'Keuangan', icon: Wallet, children: [
                { label: 'Tagihan Siswa', routeName: 'tagihan.index' },
                { label: 'Pembayaran & Verifikasi', routeName: 'pembayaran.index' },
            ]
        },
        {
            label: 'Tabungan', icon: ChickenBank, children: [
                { label: 'Data Tabungan', routeName: 'tabungan.index' },
                { label: 'Setoran', routeName: 'tabungan.setor' },
                { label: 'Penarikan', routeName: 'tabungan.tarik' },
            ]
        },
        {
            label: 'Kas Sekolah', icon: Building2, children: [
                { label: 'Kas Masuk', routeName: 'kas.masuk.index' },
                { label: 'Kas Keluar', routeName: 'kas.keluar.index' },
                { label: 'Gaji Guru', routeName: 'kas.gaji.index' },
                { label: 'Buku Kas Umum', routeName: 'kas.bku' },
            ]
        },
        {
            label: 'Laporan', icon: FileText, children: [
                { label: 'Dashboard Laporan', routeName: 'laporan.dashboard' },
                { label: 'Laporan Keuangan', routeName: 'laporan.keuangan' },
                { label: 'Laporan Tagihan Siswa', routeName: 'laporan.tagihan' },
                { label: 'Rekap Kategori', routeName: 'laporan.rekap' },
            ]
        },
        {
            label: 'Pengaturan', icon: Settings, children: [
                { label: 'Log Aktivitas', routeName: 'log.index' },
                { label: 'Backup & Restore', routeName: 'backup.index' },
                { label: 'Notifikasi', routeName: 'notifikasi.index' },
            ]
        },
    ],
    // ... we keep other roles as is, just adapt the styling
    bendahara: [
        { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
        {
            label: 'Keuangan', icon: Wallet, children: [
                { label: 'Tagihan Siswa', routeName: 'tagihan.index' },
                { label: 'Pembayaran & Verifikasi', routeName: 'pembayaran.index' },
            ]
        },
        {
            label: 'Tabungan', icon: ChickenBank, children: [
                { label: 'Data Tabungan', routeName: 'tabungan.index' },
                { label: 'Setoran', routeName: 'tabungan.setor' },
                { label: 'Penarikan', routeName: 'tabungan.tarik' },
            ]
        },
        {
            label: 'Kas Sekolah', icon: BookOpen, children: [
                { label: 'Kas Masuk', routeName: 'kas.masuk.index' },
                { label: 'Kas Keluar', routeName: 'kas.keluar.index' },
                { label: 'Gaji Guru', routeName: 'kas.gaji.index' },
                { label: 'Buku Kas Umum', routeName: 'kas.bku' },
            ]
        },
        {
            label: 'Laporan', icon: FileText, children: [
                { label: 'Laporan Keuangan', routeName: 'laporan.keuangan' },
                { label: 'Laporan Tagihan Siswa', routeName: 'laporan.tagihan' },
            ]
        },
    ],
    kepala_sekolah: [
        { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
        {
            label: 'Laporan', icon: BarChart3, children: [
                { label: 'Dashboard Laporan', routeName: 'laporan.dashboard' },
                { label: 'Laporan Keuangan', routeName: 'laporan.keuangan' },
                { label: 'Laporan Tagihan Siswa', routeName: 'laporan.tagihan' },
                { label: 'Rekap Kategori', routeName: 'laporan.rekap' },
            ]
        },
        {
            label: 'Data', icon: FolderOpen, children: [
                { label: 'Data Siswa', routeName: 'siswa.index' },
                { label: 'Data Guru', routeName: 'guru.index' },
            ]
        },
    ],
    kepala_yayasan: [
        { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
        {
            label: 'Laporan', icon: BarChart3, children: [
                { label: 'Dashboard Laporan', routeName: 'laporan.dashboard' },
                { label: 'Laporan Keuangan', routeName: 'laporan.keuangan' },
                { label: 'Laporan Tagihan Siswa', routeName: 'laporan.tagihan' },
                { label: 'Rekap Kategori', routeName: 'laporan.rekap' },
            ]
        },
    ],
    orang_tua: [
        { label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard' },
        { label: 'Tagihan & Pembayaran', icon: Receipt, routeName: 'portal.tagihan' },
        { label: 'Tabungan Anak', icon: ChickenBank, routeName: 'portal.tabungan' },
    ],
};

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentRole = 'admin', theme, toggleTheme }) {
    const { url } = usePage();
    const [expanded, setExpanded] = useState({});

    // Fix icon placeholder
    const BuildIcon = Building2;

    const menus = menuConfig[currentRole] || menuConfig.admin;

    const toggleExpand = (label) => {
        setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const resolveHref = (routeName) => {
        try {
            return route(routeName);
        } catch (e) {
            return '#';
        }
    };

    const isActive = (routeName) => {
        if (routeName === '#') return false;
        try {
            if (route().current(routeName)) return true;

            // Check exact wildcard context if it's an index route
            // e.g. siswa.index -> matches siswa.create, siswa.edit, dll
            if (routeName.endsWith('.index')) {
                const prefixMatch = routeName.replace('.index', '.*');
                return route().current(prefixMatch);
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    const isChildActive = (children) => children?.some(child => isActive(child.routeName));

    const isExpanded = (item) => {
        if (expanded[item.label] !== undefined) return expanded[item.label];
        return isChildActive(item.children);
    };

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60
                transform transition-all duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:z-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col shadow-xl lg:shadow-none
            `}>
                {/* Header Logo Area */}
                <div className="flex items-center justify-between px-6 pt-8 pb-6">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">
                            {usePage().props.sekolah?.logo_url ? (
                                <img src={usePage().props.sekolah.logo_url} alt="Logo Yayasan" className="w-full h-full object-contain" />
                            ) : (
                                <img src="/images/logoppl.png" alt="Logo Default" className="w-full h-full object-contain" />
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-slate-900 dark:text-white font-bold text-[15px] leading-tight truncate transition-colors">
                                {usePage().props.sekolah?.nama_sekolah || 'Yayasan La Tahzan'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-0.5 transition-colors">School System</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 sidebar-scrollbar mt-2">
                    {menus.map((item, idx) => {
                        const Icon = item.icon || BuildIcon;
                        const hasChildren = !!item.children;
                        const active = !hasChildren && isActive(item.routeName);
                        const childActive = hasChildren && isChildActive(item.children);
                        const open = hasChildren && isExpanded(item);

                        // Spacer for specific sections if needed based on design (like Pengaturan at bottom)
                        const isBottomSection = item.label === 'Pengaturan';

                        return (
                            <div key={idx} className={isBottomSection ? "mt-8" : ""}>
                                {/* Parent item */}
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleExpand(item.label)}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-[10px] rounded-[14px] text-[13.5px]
                                            transition-all duration-200 group
                                            ${childActive
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${childActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${childActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} ${open ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                ) : (
                                    <Link
                                        href={resolveHref(item.routeName)}
                                        className={`
                                            flex items-center gap-3 px-4 py-[10px] rounded-[14px] text-[13.5px]
                                            transition-all duration-200 group relative
                                            ${active
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}

                                {/* Children */}
                                {hasChildren && open && (
                                    <div className="ml-[42px] border-l-2 border-slate-100 mt-1 mb-2 space-y-1">
                                        {item.children.map((child, childIdx) => {
                                            const childIsActive = isActive(child.routeName);
                                            return (
                                                <Link
                                                    key={childIdx}
                                                    href={resolveHref(child.routeName)}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-2 rounded-xl text-[13px]
                                                        transition-all duration-200 ml-[-2px] relative
                                                        ${childIsActive
                                                            ? 'text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/5'
                                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium border-l-2 border-transparent'
                                                        }
                                                    `}
                                                >
                                                    <span>{child.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer User Profile */}
                <div className="px-5 py-6 space-y-4">

                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors">
                            <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                                {(usePage().props.auth?.user?.name || 'User')[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate transition-colors">
                                {usePage().props.auth?.user?.name || 'Admin Sekolah'}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate transition-colors">
                                {usePage().props.auth?.user?.email || 'admin@latahzan.sch.id'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
