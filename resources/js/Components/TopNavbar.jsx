import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Bell, Menu, ChevronRight, User, Settings, LogOut } from 'lucide-react';

export default function TopNavbar({ setSidebarOpen, breadcrumbs = [] }) {
    const { auth, unreadNotificationsCount, latestNotifications } = usePage().props;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const userMenuRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const notifications = latestNotifications || [];
    const unreadCount = unreadNotificationsCount || 0;

    const user = auth?.user || { name: 'Admin Sekolah', email: 'admin@latahzan.sch.id' };

    const resolveRoute = (name) => {
        try { return route(name); } catch (e) { return '#'; }
    };

    return (
        <header className="sticky top-0 z-30 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl border-none transition-colors">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-2 text-sm mt-3">
                        {/* Only show root Dashboard if the first crumb is not itself a Dashboard label */}
                        {!(breadcrumbs.length > 0 && breadcrumbs[0].label.toLowerCase().includes('dashboard')) && (
                            <Link href={resolveRoute('dashboard') !== '#' ? resolveRoute('dashboard') : '/dashboard'} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Dashboard
                            </Link>
                        )}
                        {breadcrumbs.length > 0 && breadcrumbs.map((crumb, idx) => {
                            // Automatically fix broken # links from other pages
                            let isClickable = crumb.href && crumb.href !== '#' && crumb.href !== '/dashboard';
                            // If crumb is 'Dashboard' we can make it clickable to the real dashboard route
                            if (crumb.label === 'Dashboard' && crumb.href === '#') {
                                crumb.href = resolveRoute('dashboard');
                                isClickable = true;
                            }

                            const hideRootDashboard = breadcrumbs.length > 0 && breadcrumbs[0].label.toLowerCase().includes('dashboard');
                            const showChevron = idx > 0 || !hideRootDashboard;

                            return (
                                <span key={idx} className="flex items-center gap-2">
                                    {showChevron && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
                                    {isClickable ? (
                                        <Link href={crumb.href} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-slate-900 dark:text-white font-medium transition-colors">{crumb.label}</span>
                                    )}
                                </span>
                            );
                        })}
                    </nav>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2 mt-3">
                    {/* ... Notifs */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-in">
                                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Notifikasi</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{unreadCount} baru</span>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map((notif) => (
                                        <div key={notif.id} className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 ${notif.unread ? 'bg-blue-50/30 dark:bg-blue-500/10' : ''}`}>
                                            <div className="flex items-start gap-3">
                                                {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                                                <div className={notif.unread ? '' : 'ml-5'}>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{notif.title}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.desc}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-slate-400">Belum ada notifikasi</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                                    <Link href={resolveRoute('notifikasi.index') !== '#' ? resolveRoute('notifikasi.index') : '/sistem/notifikasi'} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                        Lihat semua notifikasi
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-xs">
                                    {user.name?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-in">
                                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                </div>
                                <div className="py-1.5">
                                    <Link href={resolveRoute('profile.edit') !== '#' ? resolveRoute('profile.edit') : '/profile'} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </Link>
                                    <Link href={resolveRoute('pengaturan.index') !== '#' ? resolveRoute('pengaturan.index') : '/sistem/pengaturan'} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Pengaturan
                                    </Link>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                                    <button
                                        onClick={() => router.post(route('logout'))}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
