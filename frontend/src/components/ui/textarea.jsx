import * as React from "react"
import { cn } from "@/utils/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[120px] w-full rounded-xl border border-surface-border bg-surface-background px-input-p py-3 text-sm transition-ui duration-default ease-soft placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 focus-visible:border-brand-primary-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-subtle resize-none",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
