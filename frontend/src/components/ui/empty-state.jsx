"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"

export function EmptyState({ title, description, icons = [], action, className }) {
    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className={cn(
                "bg-white border-neutral-200 border-2 border-dashed rounded-[32px] p-16 w-full max-w-[620px] text-center relative",
                "hover:bg-neutral-50/50 hover:border-brand-primary-300 transition-colors duration-500",
                className,
            )}
        >
            <div className="flex justify-center isolate mb-8">
                {icons.length === 3 ? (
                    <>
                        {/* Left Icon */}
                        <motion.div
                            variants={{
                                initial: { x: 10, y: 6, rotate: -6 },
                                hover: { x: -25, y: -4, rotate: -15 },
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-white w-14 h-14 grid place-items-center rounded-2xl relative shadow-2xl ring-1 ring-neutral-100 text-neutral-400 z-0"
                        >
                            {React.createElement(icons[0], {
                                className: "w-7 h-7",
                            })}
                        </motion.div>

                        {/* Center Icon */}
                        <motion.div
                            variants={{
                                initial: { y: 0, scale: 1 },
                                hover: { y: -8, scale: 1.1 },
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-white w-16 h-16 grid place-items-center rounded-2xl relative z-10 shadow-2xl ring-1 ring-neutral-100 text-brand-primary-500 mx-[-12px]"
                        >
                            {React.createElement(icons[1], {
                                className: "w-8 h-8",
                            })}
                        </motion.div>

                        {/* Right Icon */}
                        <motion.div
                            variants={{
                                initial: { x: -10, y: 6, rotate: 6 },
                                hover: { x: 25, y: -4, rotate: 15 },
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-white w-14 h-14 grid place-items-center rounded-2xl relative shadow-2xl ring-1 ring-neutral-100 text-neutral-400 z-0"
                        >
                            {React.createElement(icons[2], {
                                className: "w-7 h-7",
                            })}
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        variants={{
                            initial: { y: 0 },
                            hover: { y: -10 },
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white w-16 h-16 grid place-items-center rounded-2xl shadow-2xl ring-1 ring-neutral-100 text-brand-primary-500"
                    >
                        {icons[0] &&
                            React.createElement(icons[0], {
                                className: "w-8 h-8",
                            })}
                    </motion.div>
                )}
            </div>

            <div className="space-y-3">
                <h2 className="text-neutral-900 font-black text-2xl tracking-tight">{title}</h2>
                <p className="text-sm text-neutral-500 whitespace-pre-line font-medium leading-relaxed max-w-sm mx-auto">
                    {description}
                </p>
            </div>

            {action && (
                <motion.div
                    variants={{
                        initial: { opacity: 0.8, y: 0 },
                        hover: { opacity: 1, y: -2 }
                    }}
                >
                    <Button
                        onClick={action.onClick}
                        variant="default"
                        className={cn(
                            "mt-8 h-12 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-neutral-900",
                            "shadow-xl hover:shadow-neutral-900/20 active:scale-95 transition-all"
                        )}
                    >
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    )
}
