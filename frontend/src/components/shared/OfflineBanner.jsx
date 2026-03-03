import React from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const OfflineBanner = () => {
    const isOnline = useOnlineStatus();

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[100] bg-red-600/90 backdrop-blur-sm text-white px-4 py-2.5 flex items-center justify-center gap-3 shadow-lg"
                >
                    <WifiOff size={18} />
                    <span className="text-sm font-semibold tracking-wide">
                        You are currently offline. Some features may be unavailable.
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;
