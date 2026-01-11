import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Layout,
    Users,
    DollarSign,
    TrendingUp,
    Shield,
    Cloud,
    Settings,
    Info,
    ArrowUpRight,
    Clock,
    AlertTriangle,
    Target,
    BookOpen,
    Bookmark,
    ListTodo,
    FileText,
    CheckCircle2,
    Code,
    ChevronDown,
    ChevronUp,
    Save,
    RefreshCw
} from 'lucide-react';
import testData from '../ai-analysis/test_data.json';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MouseEffect } from '@/components/ui/mouse-effect';
import { MagicCard } from '@/components/ui/magic-card';

// --- Re-implementing Dashboard with Magic Effects for Notifications Page ---

const SectionHeader = ({ title, icon: Icon, color }) => {
    const colorMap = {
        primary: 'brand-primary',
        brand: 'brand-primary',
        indigo: 'indigo',
        cyan: 'cyan',
        amber: 'amber',
        emerald: 'emerald',
        rose: 'rose'
    };
    const baseColor = colorMap[color] || 'brand-primary';

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 bg-${baseColor}-50 rounded-lg text-${baseColor}-500 shadow-sm border border-${baseColor}-100`}>
                <Icon size={18} />
            </div>
            <h2 className="text-sm font-black text-neutral-900 tracking-[0.05em] uppercase">{title}</h2>
        </div>
    );
};

const TableRow = ({ name, detail, cost, formula }) => (
    <div className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0 hover:bg-brand-primary-50/30 transition-all px-3 rounded-2xl group cursor-default">
        <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-bold text-neutral-900 leading-none">{name}</span>
            {detail && <span className="text-[10px] text-neutral-400 font-medium">{detail}</span>}
            {formula && (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-3 h-[1px]" style={{ backgroundColor: '#5d5fef' }}></div>
                    <span className="text-[9px] font-mono italic" style={{ color: '#5d5fef' }}>{formula}</span>
                </div>
            )}
        </div>
        <div className="text-right">
            <div className="flex flex-col items-end">
                <span className="text-[13px] font-black text-neutral-900 group-hover:text-brand-primary-600 transition-colors tracking-tight">
                    {cost.toLocaleString()} <span className="text-[9px] text-neutral-400 ml-0.5">MAD</span>
                </span>
            </div>
        </div>
    </div>
);

const NotificationFinancialCard = ({ title, value, icon: Icon, color, subtitle, isCurrency = true }) => {
    const colorMap = {
        primary: 'brand-primary',
        brand: 'brand-primary',
        amber: 'amber',
        cyan: 'cyan',
        emerald: 'emerald',
        rose: 'rose'
    };

    const baseColor = colorMap[color] || 'brand-primary';

    return (
        <MagicCard className="rounded-2xl shadow-subtle border border-neutral-100">
            <div className="p-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/5 blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${baseColor}-500/10`}></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{title}</p>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                            {isCurrency && <span className="text-[10px] font-bold text-neutral-400 ml-1">MAD</span>}
                        </h3>
                        {subtitle && <p className="text-[10px] text-neutral-400 font-medium leading-tight">{subtitle}</p>}
                    </div>
                    <div className={`p-3 bg-${baseColor}-50 rounded-xl text-${baseColor}-500`}>
                        <Icon size={20} />
                    </div>
                </div>
            </div>
        </MagicCard>
    );
};

const NotificationAnalysisDashboard = ({ data }) => {
    // State to track expanded epics (default: all closed)
    const [expandedEpics, setExpandedEpics] = useState({});

    // State to track expanded user stories (default: all closed)
    const [expandedStories, setExpandedStories] = useState({});

    if (!data || !data.backlog) return (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
            <Layout size={48} className="mb-4 opacity-50" />
            <p>No backlog data available to display.</p>
        </div>
    );

    const toggleEpic = (epicId) => {
        setExpandedEpics(prev => ({
            ...prev,
            [epicId]: !prev[epicId]
        }));
    };

    const toggleStory = (storyId) => {
        setExpandedStories(prev => ({
            ...prev,
            [storyId]: !prev[storyId]
        }));
    };

    return (
        <div className="w-full space-y-4 pb-20">
            {data.backlog.map((epic, epicIdx) => {
                const isEpicExpanded = expandedEpics[epic.id];

                return (
                    <motion.div
                        key={epic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: epicIdx * 0.1 }}
                    >
                        <MagicCard className="rounded-3xl border border-neutral-100 shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl transition-all duration-300">
                            {/* Epic Header */}
                            <div
                                onClick={() => toggleEpic(epic.id)}
                                className="p-6 border-b border-neutral-100 bg-gradient-to-r from-brand-primary-50/50 to-transparent cursor-pointer hover:bg-neutral-50/50 transition-colors group"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-brand-primary-500 text-white rounded-2xl shadow-lg shadow-brand-primary-500/20 mt-1">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-brand-primary-100 text-brand-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {epic.id}
                                                </span>
                                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">{epic.title}</h3>
                                            </div>
                                            <div className="p-2 bg-white rounded-full text-neutral-400 group-hover:text-brand-primary-500 shadow-sm transition-colors border border-neutral-100">
                                                {isEpicExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                        <p className="text-neutral-500 leading-relaxed font-medium text-sm pr-10">{epic.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Epic Content */}
                            {isEpicExpanded && (
                                <div className="p-6 space-y-4 bg-neutral-50/30 animate-in slide-in-from-top-4 fade-in duration-300">
                                    {epic.user_stories?.map((story) => {
                                        const isStoryExpanded = expandedStories[story.id];

                                        return (
                                            <div key={story.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                                {/* User Story Header */}
                                                <div
                                                    onClick={() => toggleStory(story.id)}
                                                    className="p-5 flex items-start gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                                                >
                                                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                                        <Bookmark size={18} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{story.id}</span>
                                                                <h4 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                                                                    {story.title}
                                                                </h4>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg">
                                                                    <span className="text-[11px] font-black text-neutral-600">{story.story_points}</span>
                                                                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Pts</span>
                                                                </div>
                                                                <div className="text-neutral-300 group-hover:text-indigo-500 transition-colors">
                                                                    {isStoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-neutral-500 font-medium line-clamp-2 md:line-clamp-none">
                                                            {story.description}
                                                        </p>

                                                        {/* Collapsible Details: Acceptance Criteria & Tasks */}
                                                        {isStoryExpanded && (
                                                            <div
                                                                className="pt-4 animate-in fade-in zoom-in-95 duration-200 cursor-auto"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {/* Acceptance Criteria */}
                                                                {story.acceptance_criteria && (
                                                                    <div className="mb-4 p-4 bg-emerald-50/50 rounded-xl space-y-2 border border-emerald-100/50">
                                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                                            Acceptance Criteria
                                                                        </p>
                                                                        <ul className="space-y-1.5">
                                                                            {story.acceptance_criteria.map((criteria, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-[11px] text-emerald-900/80 font-medium">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-sm shadow-emerald-200" />
                                                                                    <span className="leading-relaxed">{criteria}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {/* Tasks */}
                                                                {story.tasks && story.tasks.length > 0 && (
                                                                    <div className="space-y-3 pt-2 border-t border-neutral-100">
                                                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                                                            <ListTodo size={12} />
                                                                            Technical Tasks
                                                                        </p>
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {story.tasks.map((task) => (
                                                                                <div key={task.id} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                                                        <Code size={16} />
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center justify-between mb-1">
                                                                                            <h5 className="text-[13px] font-bold text-neutral-900">{task.title}</h5>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[9px] font-bold rounded uppercase">
                                                                                                    {task.role}
                                                                                                </span>
                                                                                                {task.level && (
                                                                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase">
                                                                                                        {task.level}
                                                                                                    </span>
                                                                                                )}
                                                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase flex items-center gap-1">
                                                                                                    <Clock size={10} />
                                                                                                    {task.hours}h
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-mono bg-neutral-50 p-2 rounded-lg border border-neutral-100 mt-2">
                                                                                            {task.instructions.split(/(`[^`]+`)/g).map((part, idx) =>
                                                                                                part.startsWith('`') && part.endsWith('`')
                                                                                                    ? <span key={idx} className="font-black text-neutral-800">{part.slice(1, -1)}</span>
                                                                                                    : part
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </MagicCard>
                    </motion.div>
                );
            })}
        </div>
    );
};

const NotificationsPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-neutral-50/30">
            {/* Sandbox Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-primary-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                        <Sparkles size={14} />
                        <span>UI Sandbox</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        Backlog Projection
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] rounded-full">Development Mode</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium">
                        Live preview of the generated Backlog (Epics, Stories, Tasks).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                            <Layout size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">View Mode</p>
                            <p className="text-xs font-bold text-neutral-900">Technical Blueprint</p>
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-neutral-200 mx-2"></div>

                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-6 py-3.5 bg-white text-neutral-900 border border-neutral-200 rounded-[20px] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-neutral-50 transition-all group shadow-sm"
                    >
                        <RefreshCw size={18} className="text-neutral-400 group-hover:rotate-180 transition-transform duration-500" />
                        Reanalyse
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -4, shadow: "0 25px 30px -10px rgb(0 0 0 / 0.15)" }}
                        whileTap={{ scale: 0.96 }}
                        className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-3xl"
                    >
                        <Save size={18} />
                        Store it
                    </motion.button>
                </div>
            </div>

            {/* Injected Analysis Dashboard (Specialized with Magic Cards) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <NotificationAnalysisDashboard data={testData} />
            </motion.div>
        </div>
    );
};

export default NotificationsPage;