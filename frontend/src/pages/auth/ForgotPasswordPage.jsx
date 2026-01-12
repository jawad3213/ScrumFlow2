import React, { useState } from 'react';
import { Activity, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/api';
import { isValidEmail } from '@/utils';
import logo from '@/assets/genralLogo.png';
import illustrationAlt from '@/assets/illustrationLogin2.png';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await forgotPassword(email);
            setMessage(data.status || 'If an account exists with this email, a reset link has been sent.');
            setEmail('');
        } catch (err) {
            setError(err || 'Unable to send reset link. Please try again.');
            console.error('Forgot Password error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-surface-background">
            {/* Left Column: Form */}
            <div className="w-full lg:w-[480px] bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 shadow-elevation z-10">
                <div className="mb-10 flex flex-col items-center">
                    {/* Logo */}
                    <Link to="/login">
                        <img src={logo} alt="TaskFlow Logo" className="h-20 w-auto mb-6 object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Recover Password</h1>
                    <p className="text-sm text-neutral-500 font-bold mt-1.5 text-center">Enter your email to receive a reset link</p>
                </div>

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-success-lighter border border-success-default/20 text-success-darker text-sm font-bold rounded-xl animate-in fade-in zoom-in-95 duration-default flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{message}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-2 duration-default">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-8">
                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-background border border-surface-border rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary-500/10 focus:border-brand-primary-500 transition-ui duration-default ease-soft placeholder:text-neutral-400 text-sm font-bold"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary-500 text-white font-black rounded-xl hover:bg-brand-primary-600 shadow-lg shadow-brand-primary-500/25 transition-ui duration-default ease-soft active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Send Reset Link'}
                    </button>
                </form>

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="mt-10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-brand-primary-500 transition-colors"
                >
                    <ArrowLeft size={14} className="stroke-[3]" />
                    Back to Log in
                </Link>
            </div>

            {/* Right Column: Illustration */}
            <div className="hidden lg:flex flex-1 bg-surface-background items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-secondary-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-[550px] w-full transform hover:scale-105 transition-transform duration-default ease-soft relative z-10">
                    <img
                        src={illustrationAlt}
                        alt="Recovery illustration"
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
