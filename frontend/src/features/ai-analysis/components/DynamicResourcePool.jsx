import React, { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    DollarSign,
    Target,
    Layers,
    User
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

const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRandomColor = (name) => {
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

const DynamicResourcePool = ({ onSync }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await client('/employees/available');
                setEmployees(response);
                // Initially empty selection for Dynamic mode
                setSelectedIds(new Set());
                onSync([]);
            } catch (error) {
                console.error("Failed to fetch dynamic talent:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const toggleEmployee = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);

        setSelectedIds(next);

        // Sync back to parent (Selected Only, Without Names - Privacy First)
        const selectedList = employees.filter(emp => next.has(emp.id));
        const pool = selectedList.map(emp => ({
            role: emp.specialization?.name || "Unknown",
            level: emp.specialization?.level || "Junior",
            salary: parseFloat(emp.specialization?.salary) || 0
        }));
        onSync(pool);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-surface-border shadow-subtle">
                <LoadingAnimation
                    className="w-64"
                    message="Almost ready to assemble..."
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
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">Dynamic Human Assembly</h2>
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">Select specific individuals for bespoke deployment</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-neutral-100 rounded-[24px] p-2 flex items-center gap-1 shadow-sm">
                        <div className="flex flex-col px-6 py-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Commissioned</span>
                            <span className="text-lg font-black text-purple-600 leading-none">{selectedIds.size}</span>
                        </div>
                        <div className="w-px h-8 bg-neutral-100"></div>
                        <div className="flex flex-col px-6 py-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Catalog</span>
                            <span className="text-lg font-black text-neutral-900 leading-none">{employees.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Talent Table */}
            <div className="bg-white rounded-[48px] border border-neutral-100 shadow-super overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-50 bg-neutral-50/30">
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] w-16">Assign</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Individual Identity</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Specialization</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Seniority</th>
                            <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Yield/Month</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {employees.map((emp) => {
                            const isSelected = selectedIds.has(emp.id);
                            return (
                                <motion.tr
                                    key={emp.id}
                                    variants={cascadeItem}
                                    onClick={() => toggleEmployee(emp.id)}
                                    className={cn(
                                        "group transition-all duration-500 cursor-pointer relative",
                                        isSelected ? "bg-purple-50/40" : "hover:bg-neutral-50/30"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "w-4 h-4 rounded-md border-2 transition-all duration-300 flex items-center justify-center",
                                            isSelected
                                                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30"
                                                : "bg-white border-neutral-200 group-hover:border-neutral-400"
                                        )}>
                                            <CheckCircle2
                                                size={10}
                                                strokeWidth={3}
                                                className={cn("transition-transform duration-300 scale-0", isSelected && "scale-100")}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {emp.photo ? (
                                                <div className="w-9 h-9 rounded-full border border-neutral-200 overflow-hidden shrink-0">
                                                    <img src={emp.photo} alt={emp.first_name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "w-9 h-9 rounded-full border flex items-center justify-center text-[13px] font-black shrink-0 transition-transform duration-500 group-hover:scale-110",
                                                    getRandomColor(`${emp.first_name} ${emp.last_name}`)
                                                )}>
                                                    {getInitials(`${emp.first_name} ${emp.last_name}`)}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-black text-neutral-900 tracking-tight leading-none mb-1">
                                                    {emp.first_name} {emp.last_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-black text-neutral-500 uppercase tracking-tight">
                                            {emp.specialization?.name || 'Generalist'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-neutral-50 border border-neutral-100 text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                                            {emp.specialization?.level || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-neutral-900 font-black text-sm">
                                            {parseFloat(emp.specialization?.salary || 0).toLocaleString()}
                                            <span className="text-[10px] text-emerald-600 font-black ml-1">MAD</span>
                                        </div>
                                    </td>

                                    {isSelected && (
                                        <div className="absolute inset-y-0 left-0 w-1 bg-purple-600"></div>
                                    )}
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Assembly Note */}
            <div className="bg-purple-50/30 border border-purple-100/50 p-8 rounded-[40px] flex items-start gap-6 w-full">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                    <User size={24} />
                </div>
                <div>
                    <h4 className="text-[12px] font-black text-neutral-900 uppercase tracking-widest mb-2">Manual Selection Mode</h4>
                    <p className="text-[12px] text-neutral-400 font-medium leading-relaxed">
                        In this scenario, you define the EXACT human assembly. The AI will not propose generic roles, but will optimize its strategy around these specific individuals.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default DynamicResourcePool;
