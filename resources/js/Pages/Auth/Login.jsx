import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword, tahunAjaranAktif }) {
    const { sekolah } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const namaSekolah = sekolah?.nama_sekolah || 'Yayasan La Tahzan Citeras';
    const tahunAjaranLabel = tahunAjaranAktif?.nama_tahun_ajaran || '';
    const tahunFiscal = tahunAjaranLabel ? tahunAjaranLabel.split('/')[1] || new Date().getFullYear() : new Date().getFullYear();

    return (
        <div className="login-page">
            <Head title="Masuk" />

            {/* Left Panel - Branding */}
            <div className="login-left">
                <div className="login-left-overlay"></div>
                <div className="login-left-content">
                    <div className="login-brand">
                        <div className="login-brand-logo">
                            {sekolah?.logo_url ? (
                                <img src={sekolah.logo_url} alt="Logo" className="login-logo-img" />
                            ) : (
                                <img src="/images/logoppl.png" alt="Logo Default" className="login-logo-img" />
                            )}
                        </div>
                        <div className="login-brand-divider"></div>
                    </div>

                    <h1 className="login-brand-title">{namaSekolah}</h1>
                    <p className="login-brand-subtitle">
                        Sistem Manajemen Keuangan Terpadu. Selamat datang kembali, silakan masuk ke akun Anda untuk mengelola data operasional yayasan.
                    </p>

                    <div className="login-stats">
                        <div className="login-stat-item">
                            <span className="login-stat-value">{tahunFiscal}</span>
                            <span className="login-stat-label">Fiscal Year</span>
                        </div>
                        <div className="login-stat-item">
                            <span className="login-stat-value">100%</span>
                            <span className="login-stat-label">Digital Transparency</span>
                        </div>
                    </div>

                    <div className="login-laptop-illustration">
                        <div className="login-laptop-screen">
                            <div className="login-laptop-bar">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="login-laptop-content">
                                <div className="login-laptop-line login-laptop-line--short"></div>
                                <div className="login-laptop-line"></div>
                                <div className="login-laptop-line login-laptop-line--medium"></div>
                            </div>
                        </div>
                        <div className="login-laptop-base"></div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="login-right">
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h2 className="login-form-title">Masuk</h2>
                        <p className="login-form-subtitle">Silakan lengkapi detail login Anda di bawah ini</p>
                    </div>

                    {status && <div className="login-status-message">{status}</div>}

                    <form onSubmit={submit} className="login-form">
                        <div className="login-field">
                            <label className="login-label" htmlFor="email">Username</label>
                            <div className="login-input-wrapper">
                                <span className="login-input-icon">
                                    <User size={18} />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`login-input ${errors.email ? 'login-input--error' : ''}`}
                                    placeholder="Masukkan username"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.email && <p className="login-error">{errors.email}</p>}
                        </div>

                        <div className="login-field">
                            <div className="login-label-row">
                                <label className="login-label" htmlFor="password">Password</label>
                                {canResetPassword && (
                                    <Link className="login-forgot-link" href={route('password.request')}>
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="login-input-wrapper">
                                <span className="login-input-icon">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`login-input ${errors.password ? 'login-input--error' : ''}`}
                                    placeholder="Masukkan password"
                                    required
                                />
                                <button
                                    className="login-toggle-password"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="login-error">{errors.password}</p>}
                        </div>

                        <div className="login-remember">
                            <label className="login-remember-label">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="login-remember-checkbox"
                                />
                                <span>Ingat saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="login-submit-btn"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="login-copyright">
                        <p>© {new Date().getFullYear()} {namaSekolah.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
