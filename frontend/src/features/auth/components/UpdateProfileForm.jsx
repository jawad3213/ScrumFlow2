import React, { useState, useEffect } from 'react';
import { User, Mail, Check } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateProfile } from '@/features/auth/api/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UpdateProfileForm = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await updateProfile({
                first_name: formData.firstName,
                last_name: formData.lastName
            });
            updateUser({ ...user, ...data.user });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <User className="h-32 w-32" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">First Name</label>
                        <Input
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="h-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50 font-medium"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">Last Name</label>
                        <Input
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="h-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50 font-medium"
                            placeholder="Enter your last name"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-neutral-700 tracking-tight ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 pl-12 rounded-xl focus:ring-4 focus:ring-brand-primary-500/10 transition-shadow bg-surface-background/30 border-surface-border/50 font-medium"
                            placeholder="Enter your email"
                            disabled
                        />
                    </div>
                    <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider ml-1">Email cannot be changed contact admin</p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#605BFF] hover:bg-[#605BFF]/90 text-white px-8 h-12 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-brand-primary-500/20"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>

                    {success && (
                        <div className="flex items-center gap-2 text-success-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                            <div className="h-6 w-6 rounded-full bg-success-100 flex items-center justify-center">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            Profile updated successfully
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UpdateProfileForm;
