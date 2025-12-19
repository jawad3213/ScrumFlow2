import React, { useState } from 'react';
import { Activity, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.status || 'If an account exists with this email, a reset link has been sent.');
                setEmail('');
            } else {
                setError(data.message || 'Unable to define reset link. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Forgot Password error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-background p-4">
            <div className="w-full max-w-[520px] bg-surface-card rounded-xl shadow-custom p-10 md:p-16 flex flex-col items-center">
                {/* Logo */}
                <img src="/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview.png" alt="TaskFlow Logo" className="h-20 w-auto mb-6 object-contain" />

                <h1 className="text-2xl font-bold text-neutral-900 mb-10">Recover</h1>

                {/* Success Message */}
                {message && (
                    <div className="mb-8 w-full p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 w-full p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 font-sans tracking-wide">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-neutral-400 text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/95 shadow-md shadow-brand-primary/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Reset Your Password'}
                    </button>
                </form>

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="mt-10 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand-primary transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Log in
                </Link>
            </div>
        </div >
    );
};

export default ForgotPasswordPage;
