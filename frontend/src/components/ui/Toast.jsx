import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ show, message, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
                    className="fixed bottom-8 right-8 z-[2000] flex items-center gap-4 bg-white border border-emerald-100 shadow-2xl p-4 pr-12 rounded-2xl min-w-[320px]"
                >
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">Deployment Success</h4>
                        <p className="text-[12px] font-bold text-neutral-500 italic">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-neutral-300 hover:text-neutral-900 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 rounded-full animate-shrink" style={{ animationDuration: `${duration}ms` }}></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
