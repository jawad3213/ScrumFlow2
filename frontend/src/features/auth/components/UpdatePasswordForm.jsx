import React, { useState } from 'react';
import { KeyRound, Lock, Shield } from 'lucide-react';
import { updatePassword } from '@/features/auth/api/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isValidPassword } from '@/utils';

const UpdatePasswordForm = () => {
    const { user } = useAuth();
    const hasPassword = user?.has_password !== false;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        if (!isValidPassword(passwordData.newPassword)) {
            alert("Password must be at least 8 characters and contain a letter and a number.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                new_password: passwordData.newPassword,
                new_password_confirmation: passwordData.confirmPassword,
            };

            // Only send current_password if user already has one
            if (hasPassword) {
                payload.current_password = passwordData.currentPassword;
            }

            await updatePassword(payload);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <KeyRound className="h-32 w-32" />
                </div>

                {!hasPassword && (
                    <div className="mb-6 p-4 bg-brand-primary-50 border border-brand-primary-200 rounded-2xl">
                        <p className="text-sm font-bold text-brand-primary-700">
                            You signed up with Google and don't have a password yet. Set one below to also be able to log in with your email and password.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    {hasPassword && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="h-12 pl-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-surface-border/50 my-2" />
                        </>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">New Password</label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="h-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50"
                                placeholder="Min 8 chars"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">Confirm Password</label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="h-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#605BFF] hover:bg-[#605BFF]/90 text-white px-8 h-12 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-brand-primary-500/20 w-full sm:w-auto"
                        >
                            {loading ? 'Saving...' : hasPassword ? 'Change Password' : 'Set Password'}
                        </Button>
                        {success && (
                            <span className="ml-4 text-success-600 font-bold text-sm animate-in fade-in">
                                Password updated successfully
                            </span>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-warning-50/50 border border-warning-200 rounded-3xl p-6">
                <div className="flex gap-4">
                    <div className="bg-warning-100 p-3 rounded-2xl h-fit">
                        <Shield className="h-6 w-6 text-warning-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-warning-900 tracking-tight">Protect your account</h3>
                        <p className="text-sm text-warning-700 font-medium mt-1 leading-relaxed">
                            Use a strong password and don't share it with anyone. We recommend using a unique password for growtrack.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePasswordForm;
