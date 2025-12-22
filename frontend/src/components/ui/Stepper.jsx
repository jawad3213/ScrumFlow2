import React from 'react';
import { cn } from '@/utils/utils';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between w-full max-w-2xl mx-auto relative">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-brand-primary-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm bg-white",
                                    isActive
                                        ? "border-brand-primary-500 text-brand-primary-600 scale-110 ring-4 ring-brand-primary-50"
                                        : isCompleted
                                            ? "border-brand-primary-500 bg-brand-primary-500 text-white"
                                            : "border-neutral-200 text-neutral-400 group-hover:border-neutral-300"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" strokeWidth={3} />
                                ) : (
                                    <span className="text-sm font-black">{stepNumber}</span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "absolute top-12 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300",
                                    isActive ? "text-brand-primary-600" : isCompleted ? "text-neutral-900" : "text-neutral-400"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export { Stepper };
