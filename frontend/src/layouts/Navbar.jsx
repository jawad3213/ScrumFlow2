import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { BASE_URL } from '@/utils/api';
import { USER_ROLES } from '@/utils/constants';

const Navbar = () => {
    const { user, userRole, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-border bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 px-8 shadow-subtle">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-neutral-400">
                <Link to="/dashboard" className="transition-colors hover:text-brand-primary-500">Dashboard</Link>
                {pathSegments.length > 0 && pathSegments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                        <span className={`capitalize transition-colors ${index === pathSegments.length - 1 ? 'text-neutral-900' : 'hover:text-brand-primary-500'}`}>
                            {segment.replace(/-/g, ' ')}
                        </span>
                    </React.Fragment>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-5">
                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="group flex items-center gap-3 pl-5 pr-1.5 py-1.5 bg-white border border-surface-border rounded-full hover:border-brand-primary-500/20 hover:shadow-subtle transition-all duration-default ease-soft focus:outline-none ring-offset-2 focus:ring-2 focus:ring-brand-primary-500/20"
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-black text-neutral-900 leading-none tracking-tight">
                                {user?.first_name} {user?.last_name}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-1">
                                {userRole === USER_ROLES.MANAGER ? 'Manager' : 'Team Member'}
                            </span>
                        </div>
                        <div className="relative">
                            <img
                                src={user?.avatar ? `${BASE_URL}/storage/${user.avatar}` : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.first_name || 'User'}`}
                                alt="Avatar"
                                className="h-9 w-9 rounded-full object-cover border-2 border-surface-background group-hover:border-brand-primary-50"
                            />
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-14 w-64 origin-top-right rounded-2xl border border-surface-border bg-white shadow-dropdown ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-default ease-soft p-1.5 z-50">
                            <div className="px-4 py-4 bg-surface-muted/50 rounded-xl mb-1.5 border border-surface-border/50">
                                <p className="text-sm font-black text-neutral-900 tracking-tight">{user?.first_name} {user?.last_name}</p>
                                <p className="text-[11px] font-bold text-neutral-400 truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                            </div>

                            <Link to="/profile" className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-600 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-ui duration-default ease-soft">
                                <div className="p-1.5 rounded-lg bg-neutral-100 group-hover:bg-brand-primary-100 mr-3">
                                    <User className="h-4 w-4" />
                                </div>
                                Profile
                            </Link>


                            <div className="h-px bg-surface-border my-1.5 mx-2" />

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-black text-danger-default hover:bg-danger-lighter hover:text-danger-darker transition-ui duration-default ease-soft"
                            >
                                <div className="p-1.5 rounded-lg bg-danger-lighter/50 mr-3">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
