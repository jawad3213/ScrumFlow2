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
    Inbox,
    LogOut,
    ChevronsUpDown,
    Check,
    FolderKanban,
    PieChart,
    ListTodo,
    CreditCard,
    BrainCircuit,
    Folder
} from 'lucide-react';
import { cn } from '../lib/utils';
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

const Sidebar = () => {
    const userRole = localStorage.getItem('user_role');
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState({ first_name: 'User', last_name: '', role: '' });
    const navigate = useNavigate();
    const location = useLocation();

    // Project Switcher State
    const [open, setOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState("global"); // 'global' or project ID

    // Mock Projects list - in real app, fetch from API
    const projects = [
        { value: "p1", label: "Project Alpha" },
        { value: "p2", label: "Website Redesign" },
        { value: "p3", label: "Mobile App" },
        { value: "p4", label: "Marketing Campaign" },
    ];

    useEffect(() => {
        const path = location.pathname;
        const projectMatch = path.match(/\/project\/([^\/]+)/);
        if (projectMatch && projectMatch[1]) {
            setSelectedProject(projectMatch[1]);
        } else if (!path.includes('/project/')) {
            setSelectedProject("global");
        }
    }, [location.pathname]);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (e) {
            console.error("Failed to parse user", e);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        cn(
            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100 hover:text-neutral-900 transition-colors",
            isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-500"
        );

    // Dynamic Navigation Content based on Project Selection
    const renderChefNavigation = () => {
        if (selectedProject === "global") {
            return (
                <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        {!collapsed && "Main Menu"}
                    </div>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="h-5 w-5" />
                        {!collapsed && <span>Overview</span>}
                    </NavLink>
                    <NavLink to="/my-tasks" className={navLinkClass}>
                        <CheckSquare className="h-5 w-5" />
                        {!collapsed && <span>My Tasks (Global)</span>}
                    </NavLink>
                    <NavLink to="/notifications" className={navLinkClass}>
                        <Bell className="h-5 w-5" />
                        {!collapsed && <span>Notifications</span>}
                    </NavLink>

                    {/* Management Links kept in global view for creating new things */}
                    <div className="my-2 mx-2 border-t border-neutral-200" />
                    <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        {!collapsed && "Management"}
                    </div>
                    <NavLink to="/projects/new" className={navLinkClass}>
                        <PlusCircle className="h-5 w-5" />
                        {!collapsed && <span>New Project</span>}
                    </NavLink>
                    <NavLink to="/team-global" className={navLinkClass}>
                        <Users className="h-5 w-5" />
                        {!collapsed && <span>Team Global</span>}
                    </NavLink>
                </>
            );
        } else {
            const projectId = selectedProject; // Use this in to="" paths
            return (
                <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-brand-primary uppercase tracking-wider">
                        {!collapsed && "MENU PROJET"}
                        {collapsed && "PRO"}
                    </div>

                    <NavLink to={`/project/${projectId}`} end className={navLinkClass}>
                        <LayoutDashboard className="h-5 w-5" />
                        {!collapsed && <span>Tableau de Bord</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/board`} className={navLinkClass}>
                        <FolderKanban className="h-5 w-5" />
                        {!collapsed && <span>Sprint Actuel (Kanban)</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/analysis`} className={navLinkClass}>
                        <BrainCircuit className="h-5 w-5" />
                        {!collapsed && <span>Analyse Projet (IA)</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/backlog`} className={navLinkClass}>
                        <ListTodo className="h-5 w-5" />
                        {!collapsed && <span>Product Backlog</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/team`} className={navLinkClass}>
                        <Users className="h-5 w-5" />
                        {!collapsed && <span>Gestion Équipe</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/financials`} className={navLinkClass}>
                        <PieChart className="h-5 w-5" />
                        {!collapsed && <span>Rapports & Budget</span>}
                    </NavLink>
                    <NavLink to={`/project/${projectId}/settings`} className={navLinkClass}>
                        <Settings className="h-5 w-5" />
                        {!collapsed && <span>Paramètres</span>}
                    </NavLink>
                </>
            );
        }
    };


    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white transition-all duration-300 flex flex-col",
            collapsed ? "w-[80px]" : "w-[280px]"
        )}>
            {/* Header / Logo */}
            <div className={cn("flex items-center justify-center border-b border-neutral-200 px-4 transition-all duration-300 overflow-hidden", collapsed ? "h-16" : "h-24")}>
                {collapsed ? (
                    <div className="h-10 w-10 flex items-center justify-center">
                        <img src="/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview_mini.png" alt="Logo" className="h-8 w-8 object-contain" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <img src="/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview.png" alt="TaskFlow" className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105" />
                    </div>
                )}
            </div>

            {/* Chef Project Switcher */}
            {/* Chef Project Switcher */}
            {userRole === 'chef' && (
                <>
                    <div className={cn("pt-4", collapsed ? "px-2 flex justify-center" : "px-4")}>
                        {!collapsed && (
                            <div className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                Workspace
                            </div>
                        )}

                        {collapsed ? (
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-neutral-50 text-neutral-600 border border-neutral-200 shadow-sm">
                                {selectedProject === "global" ? <Folder className="h-5 w-5" /> : <FolderKanban className="h-5 w-5" />}
                            </div>
                        ) : (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
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
                                                    : projects.find((project) => project.value === selectedProject)?.label}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[240px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search workspace..." />
                                        <CommandList>
                                            <CommandEmpty>No project found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="global"
                                                    className="text-neutral-900 data-[selected=true]:bg-brand-primary data-[selected=true]:text-white cursor-pointer"
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
                                                        className="text-neutral-900 data-[selected=true]:bg-brand-primary data-[selected=true]:text-white cursor-pointer"
                                                        onSelect={(currentValue) => {
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
                        )}
                    </div>
                    {/* Separator between Workspace and Main Menu */}
                    <div className="my-2 mx-4 border-t border-neutral-200" />
                </>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium gap-1">
                    {userRole === 'chef' ? (
                        renderChefNavigation()
                    ) : (
                        <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                {!collapsed && "Menu"}
                            </div>
                            <NavLink to="/my-tasks" className={navLinkClass}>
                                <CheckSquare className="h-5 w-5" />
                                {!collapsed && <span>My Tasks</span>}
                            </NavLink>
                            <NavLink to="/inbox" className={navLinkClass}>
                                <Inbox className="h-5 w-5" />
                                {!collapsed && <span>Inbox</span>}
                            </NavLink>
                            <NavLink to="/calendar" className={navLinkClass}>
                                <Calendar className="h-5 w-5" />
                                {!collapsed && <span>Calendar</span>}
                            </NavLink>
                            <NavLink to="/notifications" className={navLinkClass}>
                                <Bell className="h-5 w-5" />
                                {!collapsed && <span>Notifications</span>}
                            </NavLink>
                            <NavLink to="/settings" className={navLinkClass}>
                                <Settings className="h-5 w-5" />
                                {!collapsed && <span>Settings</span>}
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>

            {/* Footer / User Profile & Toggle */}
            <div className="border-t border-neutral-200 p-4 space-y-4">

                {/* User Profile Section */}
                <div className={cn(
                    "flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-2",
                    collapsed ? "justify-center border-none bg-transparent" : ""
                )}>
                    <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.first_name}`}
                        alt="Avatar"
                        className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                    />

                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-neutral-500 truncate capitalize">
                                {userRole === 'chef' ? 'Project Manager' : 'Team Member'}
                            </p>
                        </div>
                    )}

                    {!collapsed && (
                        <button
                            onClick={handleLogout}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex w-full items-center justify-center rounded-md border border-neutral-200 bg-transparent py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                    {collapsed ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                    {!collapsed && "Collapse Sidebar"}
                </button>
            </div>
        </aside >
    );
};

export default Sidebar;
