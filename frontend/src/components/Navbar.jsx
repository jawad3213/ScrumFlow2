import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';

const Navbar = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState({ first_name: 'User', last_name: '', role: '' });
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

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) setUser(storedUser);
        } catch (e) { console.error(e); }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6 shadow-sm">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
                <Link to="/dashboard" className="transition-colors hover:text-neutral-900">Dashboard</Link>
                {pathSegments.length > 0 && pathSegments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                        <span className={`capitalize font-medium ${index === pathSegments.length - 1 ? 'text-neutral-900' : 'transition-colors hover:text-neutral-900'}`}>
                            {segment.replace(/-/g, ' ')}
                        </span>
                    </React.Fragment>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
                {/* Search Input */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-md border border-neutral-200 bg-transparent pl-9 pr-4 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative rounded-full p-2 hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.first_name}`}
                            alt="Avatar"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-11 w-56 origin-top-right rounded-md border border-neutral-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 p-1">
                            <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                                <p className="text-sm font-medium text-neutral-900">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-neutral-500 truncate">{user.email || 'user@example.com'}</p>
                            </div>

                            <Link to="/profile" className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer">
                                <User className="mr-2 h-4 w-4" /> Profile
                            </Link>
                            <Link to="/settings" className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Link>

                            <div className="h-px bg-neutral-100 my-1" />

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
