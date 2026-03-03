import { cn } from "@/utils/utils";
import React from "react";
import "./siri-orb.css";

const SiriOrb = ({
    size = "192px",
    className,
    colors,
    animationDuration = 20,
}) => {
    const defaultColors = {
        bg: "transparent",
        c1: "oklch(75% 0.15 350)",
        c2: "oklch(80% 0.12 200)",
        c3: "oklch(78% 0.14 280)",
    }

    const finalColors = { ...defaultColors, ...colors }
    const sizeValue = parseInt(size.replace("px", ""), 10) || 192

    const blurAmount = Math.max(sizeValue * 0.08, 8)
    const contrastAmount = Math.max(sizeValue * 0.003, 1.8)

    return (
        <div
            className={cn("siri-orb", className)}
            style={{
                width: size,
                height: size,
                "--bg": finalColors.bg,
                "--c1": finalColors.c1,
                "--c2": finalColors.c2,
                "--c3": finalColors.c3,
                "--animation-duration": `${animationDuration}s`,
                "--blur-amount": `${blurAmount}px`,
                "--contrast-amount": contrastAmount,
            }
            }
        >
        </div>
    )
}

export default SiriOrb;
