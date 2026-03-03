import React from 'react';
import { Check, Circle } from 'lucide-react';

const ProjectProgressStepper = ({ project }) => {
    // Determine status of each step based on data presence
    const hasStrategic = !!project.roi_analysis_summary;
    // Technical Blueprint is considered done if we have epics or tasks generated
    const hasTechnical = (project.epics && project.epics.length > 0) || (!!project.architecture_plan && project.architecture_plan.length > 0);
    // Stack Choice is done if we have a saved stack name
    const hasStack = !!project.stack_name;

    const steps = [
        { id: 1, label: 'Financial Blueprint', completed: hasStrategic },
        { id: 2, label: 'Scrum Master Blueprint', completed: hasTechnical },
        { id: 3, label: 'Technology Stack', completed: hasStack },
    ];

    return (
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">Analysis Progress</h4>
            <div className="relative flex justify-between w-full max-w-4xl mx-auto">
                {/* Connecting Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-100 -translate-y-1/2 z-0" />

                {/* Steps */}
                {steps.map((step, index) => {
                    // Calculate progress line fill for this segment
                    const isLast = index === steps.length - 1;
                    const isCompleted = step.completed;
                    const isNext = !isCompleted && (index === 0 || steps[index - 1].completed);

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-brand-primary-500 border-brand-primary-500 text-white shadow-md shadow-brand-primary-500/20'
                                        : isNext
                                            ? 'bg-white border-brand-primary-500 text-brand-primary-500 animate-pulse'
                                            : 'bg-white border-neutral-200 text-neutral-300'
                                    }
                                `}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-bold">{step.id}</span>}
                            </div>
                            <span className={`mt-3 text-[10px] font-bold uppercase tracking-wide transition-colors duration-300 ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectProgressStepper;
