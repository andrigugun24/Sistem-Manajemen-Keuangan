export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', subtitle }) {
    const colorMap = {
        primary: {
            bg: 'bg-indigo-50',
            icon: 'bg-primary',
            shadow: 'shadow-primary/30',
            text: 'text-primary',
        },
        indigo: {
            bg: 'bg-indigo-50',
            icon: 'bg-indigo-500',
            shadow: 'shadow-indigo-500/20',
            text: 'text-indigo-600',
        },
        emerald: {
            bg: 'bg-emerald-50',
            icon: 'bg-emerald-500',
            shadow: 'shadow-emerald-500/20',
            text: 'text-emerald-600',
        },
        amber: {
            bg: 'bg-amber-50',
            icon: 'bg-amber-500',
            shadow: 'shadow-amber-500/20',
            text: 'text-amber-600',
        },
        red: {
            bg: 'bg-red-50',
            icon: 'bg-red-500',
            shadow: 'shadow-red-500/20',
            text: 'text-red-600',
        },
        blue: {
            bg: 'bg-blue-50',
            icon: 'bg-blue-500',
            shadow: 'shadow-blue-500/20',
            text: 'text-blue-600',
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'bg-purple-500',
            shadow: 'shadow-purple-500/20',
            text: 'text-purple-600',
        },
    };

    const c = colorMap[color] || colorMap.primary;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col h-full hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">{title}</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
                        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${c.icon} ${c.shadow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                        {typeof Icon === 'string' ? (
                            <span className="material-symbols-outlined text-white text-[24px]">{Icon}</span>
                        ) : Icon ? (
                            <Icon className="w-6 h-6 text-white" />
                        ) : (
                            <span className="material-symbols-outlined text-white text-[24px]">query_stats</span>
                        )}
                    </div>
                </div>

                {trend !== undefined && (
                    <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                                trend === 'down' ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-700'
                            }`}>
                            {trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                            {trend === 'down' && <span className="material-symbols-outlined text-[14px]">trending_down</span>}
                            {trend === 'neutral' && <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>}
                            {trendValue}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">vs bulan lalu</span>
                    </div>
                )}
            </div>
        </div>
    );
}
