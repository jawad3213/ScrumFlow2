import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';
import { Check } from 'lucide-react';

// Reusing existing cascade variants for consistency
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
};

const StaffingStrategy = ({ selected, onSelect, team1Img, teamChecklistImg }) => {
    const strategies = [
        {
            id: 'internal',
            title: "Leverage Internal Talent",
            description: "Tap into your existing workspace ecosystem. Use pre-validated team members and their historic performance data for precise alignment.",
            image: teamChecklistImg,
            accent: "from-brand-primary-500/10 to-blue-500/10",
            border: "group-hover:border-brand-primary-200"
        },
        {
            id: 'custom',
            title: "Dynamic Unit Assembly",
            description: "Architect a bespoke project team from the ground up. Define custom roles and specialized expertise specifically tailored for this mission.",
            image: team1Img,
            accent: "from-purple-500/10 to-indigo-500/10",
            border: "group-hover:border-purple-200"
        }
    ];

    return (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl mx-auto py-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {strategies.map((strategy) => {
                    const isSelected = selected === strategy.id;
                    return (
                        <motion.div
                            key={strategy.id}
                            variants={cascadeItem}
                            whileHover={{ y: -8 }}
                            onClick={() => onSelect(strategy.id)}
                            className={cn(
                                "group relative bg-white rounded-[40px] border-2 p-8 cursor-pointer transition-all duration-500",
                                isSelected
                                    ? "border-brand-primary-500 shadow-2xl shadow-brand-primary-500/10 bg-brand-primary-50/5"
                                    : "border-neutral-100/80 hover:border-neutral-200 shadow-xl shadow-neutral-900/5 hover:bg-neutral-50/50"
                            )}
                        >
                            {/* Selection Badge */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-4 -right-4 w-10 h-10 bg-brand-primary-500 rounded-full flex items-center justify-center text-white shadow-xl z-20"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Image Container */}
                            <div className={cn(
                                "relative w-full aspect-[4/3] rounded-[32px] overflow-hidden mb-8 bg-neutral-50 transition-all duration-500 flex items-center justify-center",
                                isSelected ? "bg-gradient-to-br " + strategy.accent : "bg-neutral-50/50 grayscale opacity-40 group-hover:opacity-60",
                                isSelected && "scale-105 grayscale-0 opacity-100"
                            )}>
                                <img
                                    src={strategy.image}
                                    alt={strategy.title}
                                    className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-4 text-center">
                                <h3 className={cn(
                                    "text-xl font-black uppercase tracking-tight transition-colors duration-300",
                                    isSelected ? "text-brand-primary-600" : "text-neutral-400 group-hover:text-neutral-900"
                                )}>
                                    {strategy.title}
                                </h3>
                                <p className="text-sm text-neutral-400 font-medium leading-relaxed px-4">
                                    {strategy.description}
                                </p>
                            </div>

                            {/* Decorative Glow - Only for Selected */}
                            {isSelected && (
                                <div className={cn(
                                    "absolute -inset-4 rounded-[48px] blur-3xl opacity-20 -z-10 bg-gradient-to-tr",
                                    strategy.accent
                                )}></div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default StaffingStrategy;
