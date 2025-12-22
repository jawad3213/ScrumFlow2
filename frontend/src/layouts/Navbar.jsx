import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
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
                {/* Search Input */}
                <div className="relative hidden sm:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-brand-primary-500 transition-colors" />
                    <input
                        type="search"
                        placeholder="Search workspace..."
                        className="h-10 w-72 rounded-xl border border-surface-border bg-surface-background/50 pl-10 pr-4 text-sm font-medium outline-none placeholder:text-neutral-400 focus:bg-white focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/10 transition-ui duration-default ease-soft"
                    />
                </div>

                {/* Notifications */}
                <button className="relative rounded-xl p-2.5 bg-surface-background border border-surface-border hover:bg-white hover:text-brand-primary-500 hover:border-brand-primary-500/20 transition-ui duration-default ease-soft text-neutral-500 shadow-subtle">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-danger-default border-2 border-white animate-pulse"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-background border border-surface-border hover:bg-white hover:border-brand-primary-500/20 transition-ui duration-default ease-soft focus:outline-none focus:ring-4 focus:ring-brand-primary-500/10 shadow-subtle"
                    >
                        <img
                            src={user?.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.first_name || 'User'}`}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl border border-surface-border bg-white shadow-dropdown ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-default ease-soft p-1.5 z-50">
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
                            <Link to="/settings" className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-600 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-ui duration-default ease-soft">
                                <div className="p-1.5 rounded-lg bg-neutral-100 group-hover:bg-brand-primary-100 mr-3">
                                    <Settings className="h-4 w-4" />
                                </div>
                                Settings
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
