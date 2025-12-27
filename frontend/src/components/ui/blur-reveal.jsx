import React from 'react';
import { motion } from 'framer-motion';

export const BlurReveal = ({ children, delay = 0, duration = 0.8, className = "" }) => {
    return (
        <motion.span
            initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: "easeOut",
            }}
            className={className}
            style={{ display: 'inline-block' }}
        >
            {children}
        </motion.span>
    );
};
