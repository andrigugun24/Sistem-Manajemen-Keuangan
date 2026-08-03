import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X, Info, AlertTriangle } from 'lucide-react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
            setProgress(100);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
            setProgress(100);
        } else if (flash?.warning) {
            setMessage(flash.warning);
            setType('warning');
            setVisible(true);
            setProgress(100);
        } else if (flash?.info) {
            setMessage(flash.info);
            setType('info');
            setVisible(true);
            setProgress(100);
        }
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    // Auto-dismiss after 5 seconds with a smooth progress bar
    useEffect(() => {
        if (!visible) return;

        const duration = 5000;
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setVisible(false);
                    return 0;
                }
                return prev - step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [visible]);

    if (!visible || !message) return null;

    const config = {
        success: {
            icon: CheckCircle2,
            bg: 'bg-emerald-50 dark:bg-emerald-900/30',
            border: 'border-emerald-200 dark:border-emerald-700/50',
            text: 'text-emerald-800 dark:text-emerald-200',
            iconColor: 'text-emerald-500',
            progressColor: 'bg-emerald-500',
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-50 dark:bg-red-900/30',
            border: 'border-red-200 dark:border-red-700/50',
            text: 'text-red-800 dark:text-red-200',
            iconColor: 'text-red-500',
            progressColor: 'bg-red-500',
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-50 dark:bg-amber-900/30',
            border: 'border-amber-200 dark:border-amber-700/50',
            text: 'text-amber-800 dark:text-amber-200',
            iconColor: 'text-amber-500',
            progressColor: 'bg-amber-500',
        },
        info: {
            icon: Info,
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            border: 'border-blue-200 dark:border-blue-700/50',
            text: 'text-blue-800 dark:text-blue-200',
            iconColor: 'text-blue-500',
            progressColor: 'bg-blue-500',
        },
    };

    const c = config[type] || config.info;
    const Icon = c.icon;

    return (
        <div
            className={`fixed top-4 right-4 z-[100] w-full max-w-md animate-slide-in-right`}
            role="alert"
        >
            <div className={`relative overflow-hidden rounded-xl border ${c.border} ${c.bg} shadow-lg shadow-black/5 backdrop-blur-sm`}>
                <div className="flex items-start gap-3 px-4 py-3.5">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${c.iconColor}`} />
                    <p className={`text-sm font-medium flex-1 ${c.text}`}>{message}</p>
                    <button
                        onClick={() => setVisible(false)}
                        className={`p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${c.text} opacity-60 hover:opacity-100`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {/* Progress bar */}
                <div className="h-0.5 w-full bg-black/5 dark:bg-white/5">
                    <div
                        className={`h-full ${c.progressColor} transition-all duration-50 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
