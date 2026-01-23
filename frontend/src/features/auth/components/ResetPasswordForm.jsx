import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/features/auth/api/auth';

const ResetPasswordForm = ({ onSuccess }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
            if (onSuccess) {
                onSuccess();
            }
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err || 'Failed to reset password. Link might be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
        </>
    );
};

export default ResetPasswordForm;
