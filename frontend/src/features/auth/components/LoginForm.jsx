import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isValidEmail } from '@/utils';
import GoogleAuthButton from './GoogleAuthButton';

const LoginForm = () => {
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
            const message = err.message || 'Login failed. Please check your credentials.';
            setError(message);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {/* Google Auth */}
            <GoogleAuthButton label="Continue with Google" />

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-surface-border" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-surface-border" />
            </div>

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

                {/* Reset Password */}
                <div className="flex justify-end px-1">
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

            {/* Signup Link */}
            <p className="text-center text-sm text-neutral-500 font-medium mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-primary-500 hover:text-brand-primary-600 font-bold transition-colors">
                    Sign up
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
