import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    Trash2,
    Plus,
    ChevronDown,
    Briefcase,
    DollarSign,
    Target,
    Layers
} from 'lucide-react';
import client from '@/lib/axios';
import { cn } from '@/utils/utils';
import LoadingAnimation from '@/components/ui/loading-animation';

const cascadeContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const cascadeItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

const InternalResourcePool = ({ onSync }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await client('/employees/available');
                setEmployees(response);

                // Select all by default
                const allIds = new Set(response.map(emp => emp.id));
                setSelectedIds(allIds);

                // Sync initial full pool to parent (Without Names)
                const pool = response.map(emp => ({
                    role: emp.specialization?.name || "Unknown",
                    level: emp.specialization?.level || "Junior",
                    salary: parseFloat(emp.specialization?.salary) || 0
                }));
                onSync(pool);
            } catch (error) {
                console.error("Failed to fetch internal talent:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Derived State
    const groupedEmployees = React.useMemo(() => {
        return employees.reduce((acc, emp) => {
            const spec = emp.specialization?.name || 'Other';
            if (!acc[spec]) acc[spec] = [];
            acc[spec].push(emp);
            return acc;
        }, {});
    }, [employees]);

    const toggleEmployee = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);

        setSelectedIds(next);

        // Sync back to parent (Selected Only, Without Names)
        const selectedList = employees.filter(emp => next.has(emp.id));
        const pool = selectedList.map(emp => ({
            role: emp.specialization?.name || "Unknown",
            level: emp.specialization?.level || "Junior",
            salary: parseFloat(emp.specialization?.salary) || 0
        }));
        onSync(pool);
    };

    const specColors = {
        'Frontend Developer': 'bg-blue-50/50 border-blue-100',
        'Backend Developer': 'bg-purple-50/50 border-purple-100',
        'UI/UX Designer': 'bg-pink-50/50 border-pink-100',
        'Project Manager': 'bg-emerald-50/50 border-emerald-100',
        'DevOps Engineer': 'bg-orange-50/50 border-orange-100',
        'Other': 'bg-neutral-50/50 border-neutral-100'
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-surface-border shadow-subtle">
                <LoadingAnimation
                    className="w-64"
                    message="Preparing the ecosystem for you..."
                />
            </div>
        );
    }

    return (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            {/* Header & Control Center */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shadow-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">Internal Ecosystem</h2>
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">Available human resources for current deployment</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-neutral-100 rounded-[24px] p-2 flex items-center gap-1 shadow-sm">
                        <div className="flex flex-col px-6 py-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Engaged</span>
                            <span className="text-lg font-black text-brand-primary-600 leading-none">{selectedIds.size}</span>
                        </div>
                        <div className="w-px h-8 bg-neutral-100"></div>
                        <div className="flex flex-col px-6 py-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Pool Size</span>
                            <span className="text-lg font-black text-neutral-900 leading-none">{employees.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Talent Matrix Table */}
            <div className="bg-white rounded-[48px] border border-neutral-100 shadow-super overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-50 bg-neutral-50/30">
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] w-16">Deploy</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Field of Expertise</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Seniority</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Standard Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {Object.entries(groupedEmployees).map(([spec, members], groupIdx) => (
                            <React.Fragment key={spec}>
                                {members.map((emp, empIdx) => {
                                    const isSelected = selectedIds.has(emp.id);
                                    return (
                                        <motion.tr
                                            key={emp.id}
                                            variants={cascadeItem}
                                            onClick={() => toggleEmployee(emp.id)}
                                            className={cn(
                                                "group transition-all duration-500 cursor-pointer relative",
                                                isSelected
                                                    ? "bg-brand-primary-50/40"
                                                    : specColors[spec] || "bg-neutral-50/20"
                                            )}
                                        >
                                            <td className="px-6 py-4 relative">
                                                {/* Selection Gloss */}
                                                {isSelected && (
                                                    <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-primary-500"></div>
                                                )}
                                                <div className={cn(
                                                    "w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center",
                                                    isSelected
                                                        ? "bg-brand-primary-500 border-brand-primary-500 text-white shadow-lg shadow-brand-primary-500/30"
                                                        : "bg-white border-neutral-200 group-hover:border-neutral-400"
                                                )}>
                                                    <CheckCircle2
                                                        size={12}
                                                        strokeWidth={3}
                                                        className={cn("transition-transform duration-300 scale-0", isSelected && "scale-100")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-black text-neutral-700 uppercase tracking-tight">{spec}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-3 py-1 rounded-full bg-white/60 border border-white/40 text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] shadow-sm">
                                                    {emp.specialization?.level || 'Standard'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-neutral-900 font-black text-sm">
                                                    {parseFloat(emp.specialization?.salary || 0).toLocaleString()}
                                                    <span className="text-[10px] text-emerald-600 font-black ml-1">MAD</span>
                                                    <span className="text-[9px] text-neutral-300 font-bold uppercase tracking-widest ml-1">/ Month</span>
                                                </div>
                                            </td>


                                        </motion.tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {employees.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center space-y-4"
                    >
                        <div className="w-20 h-20 rounded-[32px] bg-neutral-50 flex items-center justify-center text-neutral-100">
                            <Users size={40} />
                        </div>
                        <p className="text-xs font-black text-neutral-300 uppercase tracking-[0.3em]">No internal resources found</p>
                    </motion.div>
                )}
            </div>

            {/* Bottom Insight Card */}
            <div className="w-full">
                <div className="bg-brand-primary-50/30 border border-brand-primary-100/50 p-8 rounded-[40px] flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-brand-primary-500/10 flex items-center justify-center text-brand-primary-500 shrink-0">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-black text-neutral-900 uppercase tracking-widest mb-2">Strategy Alignment</h4>
                        <p className="text-[12px] text-neutral-500 font-medium leading-relaxed">
                            Drafting internal talent allows the AI to prioritize project phases based on real-world team velocity and expertise overlaps.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InternalResourcePool;
