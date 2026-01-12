import React, { useState } from 'react';
import { Eye, EyeOff, Activity, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/genralLogo.png';
import illustrationMain from '@/assets/illustrationLogin1.png';
import { isValidEmail } from '@/utils';

const LoginPage = () => {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-surface-background">
            {/* Left Column: Login Form */}
            <div className="w-full lg:w-[480px] bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 shadow-elevation z-10">
                <div className="mb-10 flex flex-col items-center">
                    {/* Logo */}
                    <img src={logo} alt="TaskFlow Logo" className="h-20 w-auto mb-6 object-contain" />
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Log in</h1>
                    <p className="text-sm text-neutral-500 font-medium mt-1.5">Access your workspace</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-8">
                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-background border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-ui duration-default ease-soft placeholder:text-neutral-400 text-sm font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-8">
                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-background border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-ui duration-default ease-soft text-sm font-medium"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-primary-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Reset Password */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-surface-border text-brand-primary-500 focus:ring-brand-primary-500 cursor-pointer transition-ui duration-default"
                            />
                            <label htmlFor="remember" className="text-xs font-bold text-neutral-900 cursor-pointer group-hover:text-brand-primary-500 transition-colors">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" size="sm" className="text-xs font-bold text-brand-primary-500 hover:text-brand-primary-600 transition-colors">
                            Reset Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary-500 text-white font-black rounded-xl hover:bg-brand-primary-600 shadow-lg shadow-brand-primary-500/25 transition-ui duration-default ease-soft active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Log in Now'}
                    </button>
                </form>
            </div>

            {/* Right Column: Illustration */}
            <div className="hidden lg:flex flex-1 bg-surface-background items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-secondary-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-[550px] w-full transform hover:scale-105 transition-transform duration-default ease-soft relative z-10">
                    <img
                        src={illustrationMain}
                        alt="Work illustration"
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
