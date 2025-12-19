import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105 duration-200 cursor-default",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                success:
                    "border-transparent bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
                warning:
                    "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
                info:
                    "border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                danger:
                    "border-transparent bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
                neutral:
                    "border-transparent bg-neutral-500 text-white hover:bg-neutral-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
