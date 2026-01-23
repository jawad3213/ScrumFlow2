import React from 'react';
import { Plus, Trash2, UserPlus, Briefcase, GraduationCap, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';

const ROLES_CONFIG = {
    'Frontend Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
    'Backend Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
    'Fullstack Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Tech Lead', 'Software Architect'],
    'UI/UX Designer': ['Junior', 'Mid-level', 'Senior', 'Lead Designer', 'Design Principal'],
    'DevOps Engineer': ['Junior', 'Mid-level', 'Senior', 'SRE', 'Cloud Architect'],
    'Project Manager': ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'Portfolio Manager'],
    'QA Engineer': ['Junior', 'Mid-level', 'Senior', 'QA Lead', 'SDET'],
};

const ROLES = Object.keys(ROLES_CONFIG);

const cascadeContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const cascadeItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

const ResourcePool = ({ pool, setPool }) => {
    const addEmployee = () => {
        const defaultRole = 'Backend Developer';
        setPool([...pool, {
            role: defaultRole,
            level: ROLES_CONFIG[defaultRole][2], // Mid-level
            specialization: "General",
            salary: 20000
        }]);
    };

    const removeEmployee = (index) => {
        setPool(pool.filter((_, i) => i !== index));
    };

    const updateEmployee = (index, field, value) => {
        const newPool = [...pool];
        newPool[index][field] = value;

        if (field === 'role') {
            newPool[index].level = ROLES_CONFIG[value][0];
        }

        setPool(newPool);
    };

    return (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="w-full bg-white rounded-[32px] border border-neutral-100 overflow-hidden shadow-super"
        >
            <div className="bg-brand-primary-50/30 px-8 py-6 border-b border-brand-primary-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl text-brand-primary-600 shadow-sm border border-brand-primary-100/30">
                        <Users size={22} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest leading-none mb-1.5">Expertise Distribution</h3>
                        <p className="text-[10px] text-neutral-400 font-bold tracking-tight uppercase">Calibrate your talent pool for the AI engine</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addEmployee}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-5 rounded-xl transition-all shadow-xl"
                >
                    <Plus size={14} /> Add Specialist
                </motion.button>
            </div>

            <div className="p-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[9px] uppercase font-black text-neutral-400 tracking-[0.2em] border-b border-neutral-100">
                            <th className="pb-6 pl-4 font-black">Functional Role</th>
                            <th className="pb-6 font-black">Expertise Seniority</th>
                            <th className="pb-6 font-black">Monthly Budget (MAD)</th>
                            <th className="pb-6 text-right pr-4 font-black">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        <AnimatePresence initial={false}>
                            {pool.map((emp, index) => (
                                <motion.tr
                                    key={index}
                                    variants={cascadeItem}
                                    className="group hover:bg-brand-primary-50/20 transition-all duration-300"
                                >
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-400 group-hover:bg-brand-primary-100 group-hover:text-brand-primary-600 transition-all duration-500">
                                                <Briefcase size={18} />
                                            </div>
                                            <select
                                                value={emp.role}
                                                onChange={(e) => updateEmployee(index, 'role', e.target.value)}
                                                className="bg-transparent border-none text-sm font-black text-neutral-900 outline-none cursor-pointer focus:ring-0 w-full hover:text-brand-primary-600 transition-colors"
                                            >
                                                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-50/50 rounded-lg text-neutral-400">
                                                <GraduationCap size={16} />
                                            </div>
                                            <select
                                                value={emp.level}
                                                onChange={(e) => updateEmployee(index, 'level', e.target.value)}
                                                className="bg-transparent border-none text-xs font-bold text-neutral-500 outline-none cursor-pointer focus:ring-0 hover:text-neutral-900 transition-colors"
                                            >
                                                {(ROLES_CONFIG[emp.role] || []).map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="relative w-36 group">
                                            <input
                                                type="number"
                                                value={emp.salary || 0}
                                                onChange={(e) => updateEmployee(index, 'salary', parseInt(e.target.value) || 0)}
                                                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-xs font-black text-neutral-900 outline-none focus:ring-4 focus:ring-brand-primary-500/5 focus:bg-white focus:border-brand-primary-200 transition-all font-mono"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-neutral-300 pointer-events-none group-focus-within:text-brand-primary-400">MAD</span>
                                        </div>
                                    </td>
                                    <td className="py-5 text-right pr-4">
                                        <motion.button
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)" }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeEmployee(index)}
                                            className="p-3 text-neutral-300 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                <AnimatePresence>
                    {pool.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 text-center"
                        >
                            <div className="w-20 h-20 bg-neutral-50 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                                <UserPlus className="text-neutral-200" size={36} />
                            </div>
                            <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-1">Pool Depleted</h4>
                            <p className="text-xs text-neutral-400 font-medium">Add members to begin the architectural matching process.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-neutral-50 px-8 py-5 flex items-center justify-between border-t border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {pool.slice(0, 5).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-brand-primary-100 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-brand-primary-500"></div>
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        {pool.length} Resources Active
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-brand-primary-500 uppercase tracking-[0.2em] italic">
                    <Sparkles size={12} />
                    AI Ready
                </div>
            </div>
        </motion.div>
    );
};

export default ResourcePool;
