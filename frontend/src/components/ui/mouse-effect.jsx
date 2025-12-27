import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 };
const OPACITY_DURATION_BASE = 0.8;
const OPACITY_DURATION_VARIATION = 0.2;
const OPACITY_EASE = [0.4, 0, 0.2, 1];
const OPACITY_DELAY_CYCLE = 1.5;
const OPACITY_DELAY_STEP = 0.02;
const MIN_OPACITY_MULTIPLIER = 0.5;
const MAX_OPACITY_MULTIPLIER = 1.5;
const MIN_OPACITY_FALLBACK = 0.3;
const PROXIMITY_MULTIPLIER = 1.2;
const PROXIMITY_OPACITY_BOOST = 0.8;

function calculateDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function generateDots(width, height, spacing) {
    const dots = [];
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
            const x = col * spacing;
            const y = row * spacing;

            const dx = x - centerX;
            const dy = y - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            const edgeFactor = Math.min(distanceFromCenter / (maxDistance * 0.7), 1);

            if (Math.random() > edgeFactor) continue;

            const pattern = (row + col) % 3;
            const baseOpacities = [0.3, 0.5, 0.7];
            const opacity = baseOpacities[pattern] * edgeFactor;

            dots.push({
                id: `dot-${row}-${col}`,
                x,
                y,
                baseX: x,
                baseY: y,
                opacity,
            });
        }
    }
    return dots;
}

function DotComponent({ dot, index, dotSize, mouseX, mouseY, repulsionRadius, repulsionStrength }) {
    const posX = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();
        if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;

        const dx = dot.baseX - mx;
        const dy = dot.baseY - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            const force = (1 - distance / repulsionRadius) * repulsionStrength;
            const angle = Math.atan2(dy, dx);
            return Math.cos(angle) * force;
        }
        return 0;
    });

    const posY = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();
        if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;

        const dx = dot.baseX - mx;
        const dy = dot.baseY - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            const force = (1 - distance / repulsionRadius) * repulsionStrength;
            const angle = Math.atan2(dy, dx);
            return Math.sin(angle) * force;
        }
        return 0;
    });

    const opacityBoost = useTransform([mouseX, mouseY], () => {
        const mx = mouseX.get();
        const my = mouseY.get();
        if (!(Number.isFinite(mx) && Number.isFinite(my))) return 0;

        const distance = calculateDistance(dot.baseX, dot.baseY, mx, my);
        const maxDistance = repulsionRadius * PROXIMITY_MULTIPLIER;

        if (distance < maxDistance) {
            const proximityFactor = 1 - distance / maxDistance;
            return proximityFactor * PROXIMITY_OPACITY_BOOST;
        }
        return 0;
    });

    const x = useSpring(posX, SPRING_CONFIG);
    const y = useSpring(posY, SPRING_CONFIG);

    const baseMinOpacity = Math.max(dot.opacity * MIN_OPACITY_MULTIPLIER, MIN_OPACITY_FALLBACK);
    const baseMaxOpacity = Math.min(dot.opacity * MAX_OPACITY_MULTIPLIER, 1);

    const minOpacityWithBoost = useTransform(opacityBoost, (boost) => Math.min(baseMinOpacity + boost, 1));
    const delay = (index * OPACITY_DELAY_STEP) % OPACITY_DELAY_CYCLE;

    return (
        <motion.div
            animate={{ opacity: [baseMinOpacity, baseMaxOpacity, baseMinOpacity] }}
            className="absolute rounded-full bg-neutral-300 dark:bg-neutral-600 pointer-events-none"
            initial={{ opacity: baseMinOpacity }}
            style={{
                width: dotSize,
                height: dotSize,
                left: dot.baseX,
                top: dot.baseY,
                x,
                y,
                opacity: useSpring(minOpacityWithBoost, { stiffness: 150, damping: 25 }),
            }}
            transition={{
                opacity: {
                    duration: OPACITY_DURATION_BASE + (index % 4) * OPACITY_DURATION_VARIATION,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: OPACITY_EASE,
                    delay,
                    times: [0, 0.5, 1],
                },
            }}
        />
    );
}

export const MouseEffect = ({ children, className = "", dotSize = 2, dotSpacing = 16, repulsionRadius = 80, repulsionStrength = 20 }) => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
    const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
    const [dots, setDots] = useState([]);

    useEffect(() => {
        const updateDots = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newDots = generateDots(rect.width, rect.height, dotSpacing);
            setDots(newDots);
        };

        updateDots();
        const observer = new ResizeObserver(updateDots);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [dotSpacing]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        mouseX.set(Number.POSITIVE_INFINITY);
        mouseY.set(Number.POSITIVE_INFINITY);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {dots.map((dot, index) => (
                    <DotComponent
                        key={dot.id}
                        dot={dot}
                        index={index}
                        dotSize={dotSize}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        repulsionRadius={repulsionRadius}
                        repulsionStrength={repulsionStrength}
                    />
                ))}
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
