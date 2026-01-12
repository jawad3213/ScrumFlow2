import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/features/auth/api/auth';
import { isValidEmail } from '@/utils';

const ForgotPasswordForm = () => {
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
            console.error('Forgot Password error:', err);
            setError(err || 'Unable to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
        </>
    );
};

export default ForgotPasswordForm;
