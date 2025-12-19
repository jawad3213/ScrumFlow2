import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-ui duration-default ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-brand-primary-500 text-white hover:bg-brand-primary-600 shadow-subtle",
                secondary: "bg-brand-secondary-500 text-white hover:bg-brand-secondary-600 shadow-subtle",
                outline: "border border-surface-border bg-white text-neutral-700 hover:bg-surface-muted hover:text-neutral-900",
                ghost: "text-neutral-600 hover:bg-surface-muted hover:text-neutral-900",
                destructive: "bg-danger-default text-white hover:bg-danger-darker shadow-subtle",
                success: "bg-success-default text-white hover:bg-success-darker shadow-subtle",
                link: "text-brand-primary-500 underline-offset-4 hover:underline",
            },
            size: {
                default: "py-btn-py-md px-btn-px-md h-10",
                sm: "py-btn-py-sm px-btn-px-sm h-8 text-xs",
                lg: "py-btn-py-lg px-btn-px-lg h-12 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
