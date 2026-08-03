const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function Badge({ children, variant = 'neutral', dot = false, className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles[variant] || badgeStyles.neutral} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-emerald-500' :
                    variant === 'warning' ? 'bg-amber-500' :
                        variant === 'danger' ? 'bg-red-500' :
                            variant === 'info' ? 'bg-blue-500' :
                                variant === 'indigo' ? 'bg-indigo-500' :
                                    variant === 'purple' ? 'bg-purple-500' :
                                        'bg-slate-400'
                }`} />}
            {children}
        </span>
    );
}
