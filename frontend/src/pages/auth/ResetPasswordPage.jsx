import React, { useState, useEffect } from 'react';
import { Activity, Eye, EyeOff, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Get token and email from URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Password Strength Logic
    const requirements = [
        { id: 1, text: "At least 8 characters", met: password.length >= 8 },
        { id: 2, text: "Contains a number", met: /\d/.test(password) },
        { id: 3, text: "Contains a special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        { id: 4, text: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    ];

    const strengthScore = requirements.filter(r => r.met).length;
    const strengthPercentage = (strengthScore / 4) * 100;

    const getStrengthColor = () => {
        if (strengthScore <= 1) return 'bg-red-500';
        if (strengthScore === 2) return 'bg-orange-500';
        if (strengthScore === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (strengthScore < 4) {
            setError("Please meet all password requirements.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Failed to reset password. Link might be expired.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-background p-4">
                <div className="w-full max-w-[520px] bg-surface-card rounded-xl shadow-custom p-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                        <Check size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Password Reset!</h1>
                    <p className="text-neutral-500 mb-8">Your password has been successfully updated. You will be redirected to the login page shortly.</p>
                    <Link to="/login" className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-background p-4">
            <div className="w-full max-w-[520px] bg-surface-card rounded-xl shadow-custom p-10 md:p-16 flex flex-col items-center">
                {/* Logo */}
                <img src="/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview.png" alt="TaskFlow Logo" className="w-64 h-32 mb-6 object-cover" />

                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset Password</h1>
                <p className="text-neutral-500 mb-8 text-center text-sm">
                    Enter your new password below.
                </p>

                {error && (
                    <div className="mb-6 w-full p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2">
                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 font-sans">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 bg-neutral-50 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Strength Meter */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium text-neutral-500">
                            <span>Password strength</span>
                            <span className={`${strengthScore === 4 ? 'text-green-600' : 'text-neutral-400'}`}>
                                {strengthScore === 4 ? 'Strong' : strengthScore >= 2 ? 'Medium' : 'Weak'}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                style={{ width: `${Math.max(5, strengthPercentage)}%` }}
                            ></div>
                        </div>

                        {/* Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            {requirements.map((req) => (
                                <div key={req.id} className="flex items-center gap-2 text-xs">
                                    <div className={`flex items-center justify-center w-4 h-4 rounded-full ${req.met ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                                        <Check size={10} />
                                    </div>
                                    <span className={req.met ? 'text-neutral-700 font-medium' : 'text-neutral-400'}>
                                        {req.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 font-sans">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3 bg-neutral-50 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/95 shadow-md shadow-brand-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Set New Password'}
                    </button>
                </form>

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="mt-8 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand-primary transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Log in
                </Link>
            </div>
        </div >
    );
};

export default ResetPasswordPage;
