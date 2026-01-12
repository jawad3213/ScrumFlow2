import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    BookOpen,
    ChevronUp,
    ChevronDown,
    Bookmark,
    CheckCircle2,
    ListTodo,
    Code,
    Clock
} from 'lucide-react';
import { MagicCard } from '@/components/ui/magic-card';

const BacklogDashboard = ({ data }) => {
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
        setExpandedEpics(prev => ({ ...prev, [epicId]: !prev[epicId] }));
    };

    const toggleStory = (storyId) => {
        setExpandedStories(prev => ({ ...prev, [storyId]: !prev[storyId] }));
    };

    return (
        <div className="w-full space-y-4 pb-20">
            {data.backlog.map((epic, epicIdx) => {
                const isEpicExpanded = expandedEpics[epic.id];
                return (
                    <motion.div
                        key={epic.id || epicIdx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: epicIdx * 0.1 }}
                    >
                        <MagicCard className="rounded-3xl border border-neutral-100 shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl transition-all duration-300">
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
                                                    {epic.external_id || epic.id || `E-${epicIdx + 1}`}
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
                            {isEpicExpanded && (
                                <div className="p-6 space-y-4 bg-neutral-50/30 animate-in slide-in-from-top-4 fade-in duration-300">
                                    {epic.user_stories?.map((story, sIdx) => {
                                        const storyId = story.id || `${epic.id}-s-${sIdx}`;
                                        const isStoryExpanded = expandedStories[storyId];
                                        return (
                                            <div key={storyId} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                                <div
                                                    onClick={() => toggleStory(storyId)}
                                                    className="p-5 flex items-start gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                                                >
                                                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                                        <Bookmark size={18} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{story.external_id || story.id || `US-${epicIdx + 1}.${sIdx + 1}`}</span>
                                                                <h4 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{story.title}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg">
                                                                    <span className="text-[11px] font-black text-neutral-600">{story.story_points}</span>
                                                                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Pts</span>
                                                                </div>
                                                                <div className="text-neutral-300 group-hover:text-indigo-500 transition-colors">{isStoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-neutral-500 font-medium line-clamp-2 md:line-clamp-none">{story.description}</p>
                                                        {isStoryExpanded && (
                                                            <div className="pt-4 animate-in fade-in zoom-in-95 duration-200 cursor-auto" onClick={(e) => e.stopPropagation()}>
                                                                {story.acceptance_criteria && (
                                                                    <div className="mb-4 p-4 bg-emerald-50/50 rounded-xl space-y-2 border border-emerald-100/50">
                                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" />Acceptance Criteria</p>
                                                                        <ul className="space-y-1.5">
                                                                            {Array.isArray(story.acceptance_criteria) ? story.acceptance_criteria.map((criteria, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-[11px] text-emerald-900/80 font-medium">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-sm shadow-emerald-200" />
                                                                                    <span className="leading-relaxed">{criteria}</span>
                                                                                </li>
                                                                            )) : null}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {story.tasks && story.tasks.length > 0 && (
                                                                    <div className="space-y-3 pt-2 border-t border-neutral-100">
                                                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2"><ListTodo size={12} />Technical Tasks</p>
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {story.tasks.map((task, tIdx) => (
                                                                                <div key={task.id || tIdx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Code size={16} /></div>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center justify-between mb-1">
                                                                                            <h5 className="text-[13px] font-bold text-neutral-900">{task.title}</h5>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[9px] font-bold rounded uppercase">{task.role}</span>
                                                                                                {task.level && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase">{task.level}</span>}
                                                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase flex items-center gap-1"><Clock size={10} />{task.hours}h</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-mono bg-neutral-50 p-2 rounded-lg border border-neutral-100 mt-2">
                                                                                            {task.instructions && typeof task.instructions === 'string' ? task.instructions.split(/(`[^`]+`)/g).map((part, idx) =>
                                                                                                part.startsWith('`') && part.endsWith('`') ? <span key={idx} className="font-black text-neutral-800">{part.slice(1, -1)}</span> : part
                                                                                            ) : task.instructions}
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

export default BacklogDashboard;
