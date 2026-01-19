import React from 'react';
import { Key, AlertCircle, ChevronRight } from 'lucide-react';
//import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

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

const GeminiAuth = ({ apiKey, onKeyChange,  validationError, shakeControls }) => {
    return (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="max-w-md mx-auto py-8"
        >
            <div className="space-y-6">
                <motion.div variants={cascadeItem} className="p-6 bg-brand-primary-50 border border-brand-primary-100 rounded-2xl flex items-start gap-4 text-left">
                    <AlertCircle className="text-brand-primary-500 shrink-0 mt-1" size={20} />
                    <p className="text-[13px] text-neutral-600 leading-relaxed font-medium">
                        Your API key is stored locally in your browser and is only used to communicate with Google's Gemini API.
                    </p>
                </motion.div>
                <div className="space-y-4">
                    <motion.div variants={cascadeItem} className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase ml-1 flex justify-between">
                            Gemini Pro API Key
                            {validationError && <span className="text-red-500 normal-case tracking-normal">Required</span>}
                        </label>
                        <motion.div animate={shakeControls} className="relative group">
                            <div className="absolute inset-0 bg-brand-primary-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            <Key className={cn("absolute left-4 top-1/2 -translate-y-1/2 z-10", validationError ? "text-red-400" : "text-neutral-400")} size={18} />
                            <input
                                type="password"
                                placeholder="Paste your key here..."
                                className={cn(
                                    "w-full bg-neutral-50/50 border rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-8 outline-none transition-all placeholder:text-neutral-300 font-bold relative z-10",
                                    validationError
                                        ? "border-red-200 bg-red-50/10 focus:ring-red-500/5"
                                        : "border-neutral-100 focus:ring-brand-primary-500/5 focus:border-brand-primary-200"
                                )}
                                value={apiKey}
                                onChange={(e) => onKeyChange(e.target.value)}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default GeminiAuth;
