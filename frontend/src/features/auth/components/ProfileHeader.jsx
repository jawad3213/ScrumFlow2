import React, { useRef, useState } from 'react';
import { Camera, UserCircle, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateAvatar } from '@/features/auth/api/profile';
import { Badge } from '@/components/ui/badge';
import { BASE_URL } from '@/utils/api';
import { USER_ROLES } from '@/utils/constants';

const ProfileHeader = () => {
    const { user, userRole, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

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
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                        className={`w-32 h-32 rounded-3xl object-cover bg-white border-4 border-white shadow-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500 ${loading ? 'opacity-50' : ''}`}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="absolute bottom-6 right-0 p-2.5 bg-[#605BFF] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="h-4 w-4" />}
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


        </div>
    );
};

export default ProfileHeader;
