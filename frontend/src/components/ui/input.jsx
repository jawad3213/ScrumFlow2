import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-xl border border-surface-border bg-surface-background px-input-p py-2 text-sm transition-ui duration-default ease-soft file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 focus-visible:border-brand-primary-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-subtle",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
