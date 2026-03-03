"use client"

import * as React from "react"
import { Plus } from 'lucide-react';
import { motion } from "framer-motion"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"

/**
 * Animated EmptyState with fan-out icon layout.
 * Usage: <EmptyState title="..." description="..." icons={[Icon1, Icon2, Icon3]} action={{ label: "...", onClick: fn }} />
 */
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

/**
 * Simple EmptyState with single icon and optional action button.
 * Usage: <SimpleEmptyState icon={Icon} title="..." description="..." actionLabel="..." onAction={fn} />
 */
const SimpleEmptyState = ({
    icon: Icon,
    image,
    title = 'No data available',
    description = 'Get started by creating your first entry.',
    actionLabel = 'Add New',
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-primary-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
                {image ? (
                    <img src={image} alt={title} className="relative h-48 w-48 object-contain drop-shadow-2xl animate-float" />
                ) : (
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white border border-surface-border shadow-elevation ring-1 ring-black/5 ring-inset bg-gradient-to-br from-white to-surface-muted/30">
                        {Icon ? (
                            <Icon className="h-12 w-12 text-brand-primary-500" strokeWidth={1.5} />
                        ) : (
                            <div className="h-12 w-12 rounded-lg bg-neutral-100" />
                        )}
                    </div>
                )}
            </div>

            <h3 className="mb-2 text-2xl font-black tracking-tight text-neutral-900">
                {title}
            </h3>
            <p className="mb-10 max-w-[320px] text-sm font-medium leading-relaxed text-neutral-500">
                {description}
            </p>

            {onAction && (
                <Button
                    onClick={onAction}
                    className="group h-13 px-8 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-black/10 transition-all hover:-translate-y-1 active:scale-[0.98] border-b-4 border-black/20"
                >
                    <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 stroke-[3]" />
                    <span className="font-bold tracking-tight text-base">{actionLabel}</span>
                </Button>
            )}
        </div>
    );
};

export default SimpleEmptyState;
