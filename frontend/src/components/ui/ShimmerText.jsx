import { motion } from "motion/react";
import { cn } from "@/utils/utils";

export default function ShimmerText({
    text = "Text Shimmer",
    className,
}) {
    return (
        <div className="flex items-center justify-center p-2">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    animate={{
                        backgroundPosition: ["200% center", "-200% center"],
                    }}
                    className={cn(
                        "bg-[length:200%_100%] bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 bg-clip-text font-bold text-3xl text-transparent dark:from-white dark:via-neutral-600 dark:to-white leading-tight",
                        className
                    )}
                    transition={{
                        duration: 6,
                        ease: "linear",
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    {text}
                </motion.h1>
            </motion.div>
        </div>
    );
}
