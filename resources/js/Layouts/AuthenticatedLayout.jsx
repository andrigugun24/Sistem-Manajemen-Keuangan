import Sidebar from '@/Components/Sidebar';
import TopNavbar from '@/Components/TopNavbar';
import FlashMessage from '@/Components/FlashMessage';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children, breadcrumbs = [], currentRole }) {
    const { userRole } = usePage().props;
    const resolvedRole = currentRole || userRole || 'admin';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize theme from localStorage or default to system preference/light
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="bg-slate-50/50 dark:bg-slate-950 flex overflow-hidden h-screen transition-colors">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentRole={resolvedRole}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <TopNavbar
                    setSidebarOpen={setSidebarOpen}
                    breadcrumbs={breadcrumbs}
                />

                <main className="flex-1 p-4 lg:p-8 lg:pt-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Global Flash Message Toast */}
            <FlashMessage />
        </div>
    );
}
