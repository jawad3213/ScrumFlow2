import React, { useRef, useState } from 'react';
import { Camera, UserCircle, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateAvatar } from '@/features/auth/api/profile';
import { Badge } from '@/components/ui/badge';
import { BASE_URL } from '@/utils/api';
import { USER_ROLES } from '@/utils/constants';

const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRandomColor = (name) => {
    if (!name) return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    const colors = [
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-purple-100 text-purple-700 border-purple-200',
        'bg-emerald-100 text-emerald-700 border-emerald-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-rose-100 text-rose-700 border-rose-200',
        'bg-indigo-100 text-indigo-700 border-indigo-200'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const ProfileHeader = () => {
    const { user, userRole, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef(null);
    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User';

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
                    {user?.avatar && !imageError ? (
                        <img
                            src={`${BASE_URL}/storage/${user.avatar}`}
                            alt="Avatar"
                            onError={(e) => {
                                console.error('Avatar load error:', e);
                                setImageError(true);
                            }}
                            className={`w-32 h-32 rounded-3xl object-cover bg-white border-4 border-white shadow-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500 ${loading ? 'opacity-50' : ''}`}
                        />
                    ) : (
                        <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-black border-4 border-white shadow-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500 ${getRandomColor(fullName)} ${loading ? 'opacity-50' : ''}`}>
                            {getInitials(fullName)}
                        </div>
                    )}
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
