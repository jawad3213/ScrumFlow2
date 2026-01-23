"use client"

import React, { useCallback, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/utils/utils"

export function MagicCard({
    children,
    className,
    gradientSize = 200,
    gradientColor = "rgba(93, 95, 239, 0.08)",
    gradientOpacity = 0.8,
    gradientFrom = "#5D5FEF",
    gradientTo = "#4338CA",
}) {
    const mouseX = useMotionValue(-gradientSize)
    const mouseY = useMotionValue(-gradientSize)

    const reset = useCallback(() => {
        mouseX.set(-gradientSize)
        mouseY.set(-gradientSize)
    }, [gradientSize, mouseX, mouseY])

    const handlePointerMove = useCallback(
        (e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            mouseX.set(e.clientX - rect.left)
            mouseY.set(e.clientY - rect.top)
        },
        [mouseX, mouseY]
    )

    useEffect(() => {
        reset()
    }, [reset])

    useEffect(() => {
        const handleGlobalPointerOut = (e) => {
            if (!e.relatedTarget) {
                reset()
            }
        }

        const handleVisibility = () => {
            if (document.visibilityState !== "visible") {
                reset()
            }
        }

        window.addEventListener("pointerout", handleGlobalPointerOut)
        window.addEventListener("blur", reset)
        document.addEventListener("visibilitychange", handleVisibility)

        return () => {
            window.removeEventListener("pointerout", handleGlobalPointerOut)
            window.removeEventListener("blur", reset)
            document.removeEventListener("visibilitychange", handleVisibility)
        }
    }, [reset])

    return (
        <div
            className={cn("group relative rounded-[inherit]", className)}
            onPointerMove={handlePointerMove}
            onPointerLeave={reset}
            onPointerEnter={reset}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100 opacity-0"
                style={{
                    background: useMotionTemplate`
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
          ${gradientFrom}, 
          ${gradientTo}, 
          transparent 100%
          )
          `,
                }}
            />
            <div className="bg-white absolute inset-[1px] rounded-[inherit]" />
            <motion.div
                className="pointer-events-none absolute inset-[1px] rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
                    opacity: gradientOpacity,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    )
}
