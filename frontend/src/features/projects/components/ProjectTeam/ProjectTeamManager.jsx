import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    UserMinus,
    CheckCircle2,
    Search,
    Briefcase,
    ChevronRight,
    Loader2,
    AlertCircle,
    BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '@/lib/axios';
import { cn } from '@/utils/utils';
import { toast } from 'sonner';

import LoadingAnimation from '@/components/ui/LoadingAnimation';

/**
 * High-end Project Team Management Interface
 */
const ProjectTeamManager = ({ projectId }) => {
    const [team, setTeam] = useState([]);
    const [availableTalent, setAvailableTalent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTeamData();
    }, [projectId]);

    const fetchTeamData = async () => {
        setLoading(true);
        try {
            const [teamRes, talentRes] = await Promise.all([
                client(`/projects/${projectId}/team`),
                client('/employees/available')
            ]);
            setTeam(teamRes.team || []);
            setAvailableTalent(talentRes || []);
        } catch (error) {
            console.error("Failed to fetch team data:", error);
            toast.error("Error loading team data");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (requirementId, userId) => {
        setAssigningId(requirementId);
        try {
            await client(`/projects/${projectId}/team/assign`, {
                body: {
                    assigned_engineer_id: requirementId,
                    user_id: userId
                }
            });
            toast.success("Team member assigned successfully");
            fetchTeamData();
        } catch (error) {
            toast.error(error.message || "Assignment failed");
        } finally {
            setAssigningId(null);
        }
    };

    const handleUnassign = async (requirementId) => {
        setAssigningId(requirementId);
        try {
            await client(`/projects/${projectId}/team/unassign`, {
                body: { assigned_engineer_id: requirementId }
            });
            toast.success("Team member unassigned");
            fetchTeamData();
        } catch (error) {
            toast.error(error.message || "Unassignment failed");
        } finally {
            setAssigningId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-neutral-100 shadow-elevation">
                <LoadingAnimation message="Assembling Project Matrix..." />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Control */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase">Resource Allocation</h2>
                    <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mt-1">Match internal talent against AI-generated requirements</p>
                </div>

                <div className="flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl p-2 shadow-sm">
                    <div className="flex flex-col px-6">
                        <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Roles Filled</span>
                        <span className="text-xl font-black text-brand-primary-600 leading-none">
                            {team.filter(t => t.user_id).length} / {team.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Requirements (Left) */}
                <div className="xl:col-span-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((requirement) => (
                            <RequirementCard
                                key={requirement.id}
                                requirement={requirement}
                                availableTalent={availableTalent}
                                onAssign={handleAssign}
                                onUnassign={handleUnassign}
                                isProcessing={assigningId === requirement.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RequirementCard = ({ requirement, availableTalent, onAssign, onUnassign, isProcessing }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState('');

    const filteredTalent = availableTalent.filter(user =>
        user.specialization?.name === requirement.specialization?.name &&
        user.specialization?.level === requirement.specialization?.level &&
        (user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name.toLowerCase().includes(search.toLowerCase()))
    );

    const isFilled = !!requirement.user;

    return (
        <motion.div
            layout
            className={cn(
                "group bg-white rounded-[32px] border-2 transition-all duration-500 overflow-hidden",
                isFilled ? "border-brand-primary-500/10 shadow-2xl shadow-brand-primary-500/5" : "border-neutral-100 shadow-subtle hover:border-neutral-200"
            )}
        >
            {/* Card Content */}
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                        isFilled ? "bg-brand-primary-500 text-white" : "bg-neutral-50 text-neutral-400"
                    )}>
                        <Briefcase size={22} strokeWidth={2.5} />
                    </div>

                    {isFilled ? (
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in zoom-in">
                            <BadgeCheck size={12} />
                            Deployed
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                            <AlertCircle size={12} />
                            Critical Need
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight leading-tight">
                        {requirement.specialization?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                            requirement.specialization?.level === 'Senior' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                requirement.specialization?.level === 'Mid-level' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                    "bg-neutral-50 text-neutral-500 border-neutral-100"
                        )}>
                            {requirement.specialization?.level}
                        </span>
                        <div className="h-3 w-[1px] bg-neutral-200"></div>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{requirement.phase}</span>
                        <div className="w-1 h-1 rounded-full bg-neutral-200"></div>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{requirement.months_assigned}M</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isFilled ? (
                        <motion.div
                            key="filled"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-between group/member relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-brand-primary-500 font-black">
                                    {requirement.user.first_name[0]}{requirement.user.last_name[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-neutral-900 leading-none">{requirement.user.first_name} {requirement.user.last_name}</span>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Matched Talent</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onUnassign(requirement.id)}
                                disabled={isProcessing}
                                className="w-8 h-8 rounded-lg bg-white border border-neutral-100 text-neutral-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center opacity-0 group-hover/member:opacity-100 relative z-10"
                            >
                                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <UserMinus size={14} />}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" className="space-y-4">
                            {!isSearching ? (
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    onClick={() => setIsSearching(true)}
                                    className="w-full h-12 border-2 border-dashed border-neutral-100 hover:border-brand-primary-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-neutral-400 hover:text-brand-primary-600 transition-all uppercase tracking-widest"
                                >
                                    <UserPlus size={16} />
                                    Identify Talent
                                </motion.button>
                            ) : (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                                        <input
                                            autoFocus
                                            placeholder="Search by name..."
                                            className="w-full h-10 pl-10 pr-4 bg-neutral-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-primary-500/20"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {filteredTalent.length > 0 ? filteredTalent.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => onAssign(requirement.id, user.id)}
                                                className="p-3 rounded-xl border border-neutral-50 bg-white hover:border-brand-primary-500/30 hover:shadow-lg hover:shadow-brand-primary-500/5 transition-all cursor-pointer flex items-center justify-between group/item"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[10px] font-black text-neutral-500">
                                                        {user.first_name[0]}{user.last_name[0]}
                                                    </div>
                                                    <span className="text-xs font-bold text-neutral-700">{user.first_name} {user.last_name}</span>
                                                </div>
                                                <ChevronRight size={14} className="text-neutral-300 group-hover/item:text-brand-primary-500 transition-transform group-hover/item:translate-x-1" />
                                            </div>
                                        )) : (
                                            <div className="py-8 text-center bg-neutral-50 rounded-2xl flex flex-col items-center gap-2">
                                                <AlertCircle size={20} className="text-neutral-200" />
                                                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">No available matches</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setIsSearching(false)}
                                        className="w-full text-[9px] font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors"
                                    >
                                        Cancel Search
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ProjectTeamManager;
