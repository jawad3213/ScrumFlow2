import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Mail,
    Shield,
    Bell,
    Camera,
    Check,
    X,
    Lock,
    KeyRound,
    UserCircle,
    BadgeCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateAvatar, updateProfile, updatePassword } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/utils';
import { BASE_URL } from '@/utils/api';
import { USER_ROLES } from '@/utils/constants';

const ProfilePage = () => {
    const { user, userRole, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Form states
    const [formData, setFormData] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        email: user?.email || '',
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

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleUpdateProfile = async (e) => {
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

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await updatePassword({
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                new_password_confirmation: passwordData.confirmPassword,
            });
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

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setLoading(true);
        try {
            const response = await updateAvatar(formData);
            if (response.avatar_url) {
                updateUser({ ...user, avatar: response.avatar });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Header Header */}
            <div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Profile Settings</h1>
                <p className="text-neutral-500 font-medium mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-subtle text-center relative overflow-hidden group">
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-brand-primary-500/10 to-brand-primary-600/5 group-hover:from-brand-primary-500/15 transition-colors duration-500" />

                        <div className="relative pt-4">
                            <div className="relative inline-block">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <img
                                    src={user?.avatar ? `${BASE_URL}/storage/${user.avatar}` : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.first_name || 'User'}`}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-3xl object-cover bg-white border-4 border-white shadow-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-6 right-0 p-2.5 bg-[#605BFF] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>

                            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <p className="text-sm font-medium text-neutral-500 mt-0.5">{user?.email}</p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="bg-brand-primary-50 text-brand-primary-700 border-brand-primary-100 py-1 px-3 rounded-lg font-bold">
                                    {userRole === USER_ROLES.MANAGER ? 'Project Manager' : 'Team Member'}
                                </Badge>
                                <Badge variant="secondary" className="bg-success-50 text-success-700 border-success-100 py-1 px-3 rounded-lg font-bold">
                                    Active
                                </Badge>
                            </div>
                        </div>

                        <div className="h-px bg-surface-border my-6" />

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="p-2 rounded-lg bg-neutral-100">
                                    <BadgeCheck className="h-4 w-4 text-brand-primary-500" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Verified Account</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="p-2 rounded-lg bg-neutral-100">
                                    <UserCircle className="h-4 w-4 text-brand-primary-500" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Member since 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="w-full justify-start h-auto p-1.5 bg-surface-background border border-surface-border rounded-2xl mb-6 shadow-sm">
                            <TabsTrigger
                                value="personal"
                                className="flex-1 lg:flex-none gap-2 py-3 px-6 rounded-xl data-[state=active]:bg-white data-[state=active]:text-brand-primary-600 data-[state=active]:shadow-subtle transition-all duration-300 font-bold"
                            >
                                <User className="h-4 w-4" />
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="flex-1 lg:flex-none gap-2 py-3 px-6 rounded-xl data-[state=active]:bg-white data-[state=active]:text-brand-primary-600 data-[state=active]:shadow-subtle transition-all duration-300 font-bold"
                            >
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="flex-1 lg:flex-none gap-2 py-3 px-6 rounded-xl data-[state=active]:bg-white data-[state=active]:text-brand-primary-600 data-[state=active]:shadow-subtle transition-all duration-300 font-bold"
                            >
                                <Bell className="h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                        </TabsList>

                        {/* Personal Info Content */}
                        <TabsContent value="personal" className="mt-0 space-y-6">
                            <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <User className="h-32 w-32" />
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6 relative">
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
                        </TabsContent>

                        {/* Security Content */}
                        <TabsContent value="security" className="mt-0 space-y-6">
                            <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <KeyRound className="h-32 w-32" />
                                </div>

                                <form onSubmit={handleUpdatePassword} className="space-y-6 relative">
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
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </Button>
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
                                            Use a strong password and don't share it with anyone. We recommend using a unique password for TaskFlow.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Notifications Content */}
                        <TabsContent value="notifications" className="mt-0">
                            <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle flex flex-col items-center justify-center text-center py-20">
                                <div className="h-20 w-20 bg-brand-primary-50 rounded-full flex items-center justify-center mb-6">
                                    <Bell className="h-10 w-10 text-brand-primary-500" />
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Notification Settings</h3>
                                <p className="text-neutral-500 font-medium max-w-xs mt-2">
                                    Coming soon! You'll be able to manage your email and push notification preferences here.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
