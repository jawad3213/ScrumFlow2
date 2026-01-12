import React from 'react';
import { User, Shield, Bell } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileHeader from '@/features/auth/components/ProfileHeader';
import UpdateProfileForm from '@/features/auth/components/UpdateProfileForm';
import UpdatePasswordForm from '@/features/auth/components/UpdatePasswordForm';
import NotificationSettings from '@/features/auth/components/NotificationSettings';

const ProfilePage = () => {
    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Profile Settings</h1>
                <p className="text-neutral-500 font-medium mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <ProfileHeader />
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
                            <UpdateProfileForm />
                        </TabsContent>

                        {/* Security Content */}
                        <TabsContent value="security" className="mt-0 space-y-6">
                            <UpdatePasswordForm />
                        </TabsContent>

                        {/* Notifications Content */}
                        <TabsContent value="notifications" className="mt-0">
                            <NotificationSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
