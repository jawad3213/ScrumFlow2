import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/utils/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-ui duration-default ease-soft focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 hover:scale-105 cursor-default",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-brand-primary-500 text-white shadow-subtle",
                secondary:
                    "border-transparent bg-brand-primary-100 text-brand-primary-700",
                destructive:
                    "border-transparent bg-danger-lighter text-danger-darker border-danger-default/20",
                outline: "text-neutral-700 border-neutral-200",
                success:
                    "border-transparent bg-success-lighter text-success-darker border-success-default/20",
                warning:
                    "border-transparent bg-warning-lighter text-warning-darker border-warning-default/20",
                info:
                    "border-transparent bg-info-lighter text-info-darker border-info-default/20",
                danger:
                    "border-transparent bg-danger-lighter text-danger-darker border-danger-default/20",
                neutral:
                    "border-transparent bg-neutral-100 text-neutral-600",
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
