import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    PlusCircle,
    Settings,
    Bell,
    Calendar,
    Users,
    ChevronLeft,
    LogOut,
    ChevronsUpDown,
    Check,
    FolderKanban,
    PieChart,
    ListTodo,
    BrainCircuit,
    Folder,
    Loader2,
    Sparkles,
    Code,
    Layers
} from 'lucide-react';
import { cn } from '../utils/utils';
import logo from '@/assets/genralLogo.png';
import logoMini from '@/assets/MiniLogo.png';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { BASE_URL } from '@/utils/api';
import { USER_ROLES } from '@/utils/constants';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProject } from '@/features/projects/api/useProject';

import { getProjects } from '@/features/projects/api/projects';

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

const AvatarWithFallback = ({ user }) => {
    const [imageError, setImageError] = useState(false);
    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User';

    if (user?.avatar && !imageError) {
        return (
            <img
                src={`${BASE_URL}/storage/${user.avatar}`}
                alt="Avatar"
                onError={(e) => {
                    console.error('Sidebar Avatar load error:', e);
                    setImageError(true);
                }}
                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-brand-primary-100 transition-colors"
            />
        );
    }

    return (
        <div className={`h-10 w-10 flex items-center justify-center rounded-full border-2 border-white shadow-sm text-xs font-black sm:text-sm group-hover:border-brand-primary-100 transition-colors ${getRandomColor(fullName)}`}>
            {getInitials(fullName)}
        </div>
    );
};

const navLinkClass = ({ isActive }) =>
    cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-ui duration-default ease-soft",
        isActive
            ? "bg-brand-primary-50 text-brand-primary-700"
            : "text-neutral-500 hover:bg-surface-muted hover:text-neutral-900"
    );

const SidebarItem = ({ to, icon: Icon, label, collapsed, end = false }) => {
    const content = (
        <NavLink to={to} end={end} className={navLinkClass}>
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
    );

    if (!collapsed) return content;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                {content}
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={20} className="font-bold border border-white/10 shadow-lg whitespace-nowrap">
                {label}
            </TooltipContent>
        </Tooltip>
    );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
    const { user, userRole, logout } = useAuth();
    const { currentProject: selectedProject, setCurrentProject: setSelectedProject } = useProject();
    const navigate = useNavigate();
    const location = useLocation();
    const mouseEnterTimer = React.useRef(null);

    // Project Switcher State
    const [open, setOpen] = useState(false);

    // Dynamic Projects list
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    useEffect(() => {
        if (userRole === USER_ROLES.MANAGER) {
            const fetchProjects = async () => {
                setIsLoadingProjects(true);
                try {
                    const data = await getProjects();
                    // Transform API data to combobox format if needed
                    // The API returns an array of project objects
                    const formattedProjects = data.map(project => ({
                        value: project.id.toString(),
                        label: project.name
                    }));
                    setProjects(formattedProjects);
                } catch (error) {
                    console.error("Error fetching projects:", error);
                } finally {
                    setIsLoadingProjects(false);
                }
            };
            fetchProjects();
        }
    }, [userRole]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderChefNavigation = () => {
        if (selectedProject === "global") {
            return (
                <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-brand-primary-500 uppercase tracking-wider">
                        {!collapsed && "Main Menu"}
                    </div>
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" collapsed={collapsed} />
                    <SidebarItem to="/projects/new" icon={PlusCircle} label="New Project" collapsed={collapsed} />
                    <SidebarItem to="/team-global" icon={Users} label="Global Team" collapsed={collapsed} />
                    <SidebarItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
                </>
            );
        } else {
            const projectId = selectedProject;
            return (
                <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-brand-primary-500 uppercase tracking-wider">
                        {!collapsed && "Project Menu"}
                    </div>

                    <SidebarItem to={`/project/${projectId}`} icon={LayoutDashboard} label="Overview" collapsed={collapsed} end />
                    <SidebarItem to={`/project/${projectId}/hub`} icon={Sparkles} label="Strategic Blueprint" collapsed={collapsed} />
                    <SidebarItem to={`/project/${projectId}/blueprint`} icon={Code} label="Technical Blueprint" collapsed={collapsed} />
                    <SidebarItem to={`/project/${projectId}/stack`} icon={Layers} label="Stack Choice" collapsed={collapsed} />
                    <SidebarItem to={`/project/${projectId}/project-team`} icon={Users} label="Project Team" collapsed={collapsed} />


                </>
            );
        }
    };

    return (
        <TooltipProvider>
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-surface-border bg-white transition-ui duration-300 ease-soft flex flex-col",
                collapsed ? "w-[80px]" : "w-[280px]"
            )}>
                {/* Header / Logo */}
                <div className={cn(
                    "flex items-center h-16 border-b border-surface-border transition-all duration-default",
                    collapsed ? "px-2 justify-center" : "px-6"
                )}>
                    {collapsed ? (
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-primary-50">
                            <img src={logoMini} alt="Logo" className="h-7 w-7 object-contain" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="TaskFlow" className="h-10 w-auto object-contain" />
                        </div>
                    )}
                </div>

                {/* Chef Project Switcher */}
                {userRole === USER_ROLES.MANAGER && (
                    <>
                        <div className={cn("pt-6", collapsed ? "px-2 flex justify-center" : "px-4")}>
                            {!collapsed && (
                                <div className="px-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">
                                    Workspace
                                </div>
                            )}

                            <Popover open={open} onOpenChange={setOpen}>
                                {collapsed ? (
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <PopoverTrigger asChild>
                                                <button
                                                    className={cn(
                                                        "h-10 w-10 flex items-center justify-center rounded-lg transition-all cursor-pointer",
                                                        selectedProject === "global"
                                                            ? "bg-[#605BFF] text-white"
                                                            : "bg-transparent text-neutral-900 hover:bg-neutral-100"
                                                    )}
                                                    onMouseEnter={() => {
                                                        clearTimeout(mouseEnterTimer.current);
                                                        setOpen(true);
                                                    }}
                                                    onMouseLeave={() => {
                                                        mouseEnterTimer.current = setTimeout(() => setOpen(false), 200);
                                                    }}
                                                >
                                                    {selectedProject === "global" ? <Folder className="h-5 w-5" /> : <FolderKanban className="h-5 w-5" />}
                                                </button>
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" sideOffset={20} className="font-bold border border-white/10 shadow-lg whitespace-nowrap">
                                            {selectedProject === "global" ? "Vue Globale" : projects.find((p) => p.value === selectedProject)?.label || (isLoadingProjects ? "Loading..." : "Workspace")}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className={cn(
                                                "w-full justify-between transition-all duration-200 text-neutral-900 font-bold",
                                                selectedProject === "global"
                                                    ? "bg-[#605BFF] text-white border-[#605BFF] hover:bg-[#605BFF]/90"
                                                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                {selectedProject === "global" ? (
                                                    <Folder className="h-4 w-4 shrink-0" />
                                                ) : (
                                                    <FolderKanban className="h-4 w-4 shrink-0" />
                                                )}
                                                <span className="truncate">
                                                    {selectedProject === "global"
                                                        ? "Vue Globale"
                                                        : projects.find((project) => project.value === selectedProject)?.label || (isLoadingProjects ? "Loading..." : "Project")}
                                                </span>
                                            </div>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                )}

                                <PopoverContent
                                    side={collapsed ? "right" : "bottom"}
                                    align={collapsed ? "start" : "center"}
                                    sideOffset={collapsed ? 20 : 4}
                                    className="w-[240px] p-0"
                                    onMouseEnter={() => {
                                        clearTimeout(mouseEnterTimer.current);
                                        setOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                        mouseEnterTimer.current = setTimeout(() => setOpen(false), 200);
                                    }}
                                >
                                    <Command>
                                        <CommandInput placeholder="Search workspace..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                {isLoadingProjects ? (
                                                    <div className="flex items-center justify-center p-4">
                                                        <Loader2 className="h-4 w-4 animate-spin text-brand-primary-500" />
                                                    </div>
                                                ) : "No project found."}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="global"
                                                    className={cn(
                                                        "cursor-pointer rounded-lg m-1 font-bold transition-colors text-black",
                                                        selectedProject === "global" && "bg-[#605BFF]/10 text-[#605BFF]",
                                                        "data-[selected=true]:bg-[#605BFF] data-[selected=true]:text-white"
                                                    )}
                                                    onSelect={() => {
                                                        setSelectedProject("global");
                                                        setOpen(false);
                                                        navigate('/dashboard');
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedProject === "global" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    Vue Globale
                                                </CommandItem>
                                                {projects.map((project) => (
                                                    <CommandItem
                                                        key={project.value}
                                                        value={project.value}
                                                        className={cn(
                                                            "cursor-pointer rounded-lg m-1 font-bold transition-colors text-black",
                                                            selectedProject === project.value && "bg-[#605BFF]/10 text-[#605BFF]",
                                                            "data-[selected=true]:bg-[#605BFF] data-[selected=true]:text-white"
                                                        )}
                                                        onSelect={() => {
                                                            setSelectedProject(project.value);
                                                            setOpen(false);
                                                            navigate(`/project/${project.value}`);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedProject === project.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {project.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Separator between Workspace and Main Menu */}
                        <div className="my-2 mx-4 border-t border-neutral-200" />
                    </>
                )}

                <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
                    <nav className="grid items-start px-4 text-sm font-medium gap-1">
                        {userRole === USER_ROLES.MANAGER ? (
                            renderChefNavigation()
                        ) : (
                            <>
                                <div className="px-2 py-1.5 text-xs font-semibold text-brand-primary-500 uppercase tracking-wider">
                                    {!collapsed && "Menu"}
                                </div>

                                <SidebarItem to="/notifications" icon={Bell} label="Notifications" collapsed={collapsed} />
                                <SidebarItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
                            </>
                        )}
                    </nav>
                </div>

                {/* Footer / User Profile & Toggle */}
                <div className="border-t border-neutral-200 p-4 space-y-4">
                    {/* User Profile Section */}
                    {/* User Profile Section */}
                    {collapsed ? (
                        <div className="flex justify-center">
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl text-neutral-400 hover:text-danger-default hover:bg-danger-lighter transition-all"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={20} className="font-bold border border-white/10 shadow-lg bg-danger-default text-white whitespace-nowrap">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <div
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-background p-3 shadow-subtle cursor-pointer hover:bg-brand-primary-50/50 hover:border-brand-primary-200 transition-all group"
                        >
                            <div className="relative">
                                <AvatarWithFallback user={user} />
                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-default border-2 border-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-neutral-900 truncate tracking-tight group-hover:text-brand-primary-700 transition-colors">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-[10px] text-neutral-500 truncate uppercase font-black tracking-widest">
                                    {userRole === USER_ROLES.MANAGER ? 'Manager' : 'Team'}
                                </p>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                                className="text-neutral-400 hover:text-danger-default transition-colors p-1.5 hover:bg-danger-lighter rounded-lg text-right"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="flex w-full items-center justify-center rounded-xl border border-surface-border bg-transparent py-2.5 text-xs font-bold text-neutral-500 hover:bg-surface-muted hover:text-neutral-900 transition-ui duration-default ease-soft"
                            >
                                {collapsed ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                                {!collapsed && "Collapse Sidebar"}
                            </button>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right" sideOffset={20} className="font-bold border border-white/10 shadow-lg whitespace-nowrap">
                                Expand Sidebar
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            </aside >
        </TooltipProvider>
    );
};

export default Sidebar;
