import React from 'react';
import { Bell } from 'lucide-react';

const NotificationSettings = () => {
    return (
        <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle flex flex-col items-center justify-center text-center py-20">
            <div className="h-20 w-20 bg-brand-primary-50 rounded-full flex items-center justify-center mb-6">
                <Bell className="h-10 w-10 text-brand-primary-500" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight">Notification Settings</h3>
            <p className="text-neutral-500 font-medium max-w-xs mt-2">
                Coming soon! You'll be able to manage your email and push notification preferences here.
            </p>
        </div>
    );
};

export default NotificationSettings;
