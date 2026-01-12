import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/api';
import logo from '@/assets/genralLogo.png';
import illustrationAlt from '@/assets/illustrationLogin2.png';

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
            await resetPassword({
                token,
                email,
                password,
                password_confirmation: confirmPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err || 'Failed to reset password. Link might be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex bg-surface-background">
                <div className="w-full lg:w-[480px] bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 shadow-elevation z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-success-lighter rounded-full flex items-center justify-center text-success-default mb-8 border border-success-default/10 animate-in zoom-in-95 duration-default">
                            <Check size={48} className="stroke-[3]" />
                        </div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-4">Password Reset!</h1>
                        <p className="text-sm text-neutral-500 font-bold mb-10 leading-relaxed">
                            Your password has been successfully updated. You will be redirected to the login page shortly.
                        </p>
                        <Link to="/login" className="w-full py-4 bg-success-default text-white font-black rounded-xl hover:bg-success-darker shadow-lg shadow-success-default/25 transition-ui duration-default ease-soft active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            Go to Login
                        </Link>
                    </div>
                </div>
                <div className="hidden lg:flex flex-1 bg-surface-background items-center justify-center p-12 relative overflow-hidden">
                    <img src={illustrationAlt} alt="Success illustration" className="max-w-[550px] w-full transform hover:scale-105 transition-transform duration-default ease-soft relative z-10 drop-shadow-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-surface-background">
            {/* Left Column: Form */}
            <div className="w-full lg:w-[480px] bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 shadow-elevation z-10 overflow-y-auto">
                <div className="mb-10 flex flex-col items-center">
                    {/* Logo */}
                    <Link to="/login">
                        <img src={logo} alt="TaskFlow Logo" className="h-20 w-auto mb-6 object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Set New Password</h1>
                    <p className="text-sm text-neutral-500 font-bold mt-1.5 text-center">Ensure your new password is secure</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-2 duration-default flex items-start gap-2">
                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div className="space-y-8">
                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-background border border-surface-border rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary-500/10 focus:border-brand-primary-500 transition-ui duration-default ease-soft text-sm font-bold"
                                placeholder="••••••••"
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

                    {/* Strength Meter */}
                    <div className="p-4 bg-surface-background rounded-xl border border-surface-border space-y-4 shadow-subtle">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                            <span className="text-neutral-900">Security Strength</span>
                            <span className={strengthScore === 4 ? 'text-success-default' : 'text-neutral-900'}>
                                {strengthScore === 4 ? 'Optimal' : strengthScore >= 2 ? 'Moderate' : 'Critical'}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-default ease-soft ${strengthScore <= 1 ? 'bg-danger-default' :
                                    strengthScore === 2 ? 'bg-warning-default' :
                                        strengthScore === 3 ? 'bg-info-default' : 'bg-success-default'
                                    }`}
                                style={{ width: `${Math.max(5, strengthPercentage)}%` }}
                            ></div>
                        </div>

                        {/* Checklist */}
                        <div className="grid grid-cols-1 gap-2.5">
                            {requirements.map((req) => (
                                <div key={req.id} className="flex items-center gap-2.5 text-[11px] font-bold">
                                    <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-ui duration-default ${req.met ? 'bg-success-lighter text-success-default' : 'bg-neutral-100 text-neutral-300'}`}>
                                        <Check size={10} className="stroke-[4]" />
                                    </div>
                                    <span className={req.met ? 'text-neutral-700' : 'text-neutral-400'}>
                                        {req.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-8">
                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-background border border-surface-border rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary-500/10 focus:border-brand-primary-500 transition-ui duration-default ease-soft text-sm font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-primary-500 text-white font-black rounded-xl hover:bg-brand-primary-600 shadow-lg shadow-brand-primary-500/25 transition-ui duration-default ease-soft active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Update Password'}
                    </button>
                </form>

                {/* Back to Login */}
                <Link
                    to="/login"
                    className="mt-8 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-brand-primary-500 transition-colors"
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
                        alt="Security illustration"
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
