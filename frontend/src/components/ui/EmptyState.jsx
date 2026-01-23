import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './button';

const EmptyState = ({
    icon: Icon,
    image,
    title = 'No data available',
    description = 'Get started by creating your first entry.',
    actionLabel = 'Add New',
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-primary-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
                {image ? (
                    <img src={image} alt={title} className="relative h-48 w-48 object-contain drop-shadow-2xl animate-float" />
                ) : (
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white border border-surface-border shadow-elevation ring-1 ring-black/5 ring-inset bg-gradient-to-br from-white to-surface-muted/30">
                        {Icon ? (
                            <Icon className="h-12 w-12 text-brand-primary-500" strokeWidth={1.5} />
                        ) : (
                            <div className="h-12 w-12 rounded-lg bg-neutral-100" />
                        )}
                    </div>
                )}
            </div>

            <h3 className="mb-2 text-2xl font-black tracking-tight text-neutral-900">
                {title}
            </h3>
            <p className="mb-10 max-w-[320px] text-sm font-medium leading-relaxed text-neutral-500">
                {description}
            </p>

            {onAction && (
                <Button
                    onClick={onAction}
                    className="group h-13 px-8 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-black/10 transition-all hover:-translate-y-1 active:scale-[0.98] border-b-4 border-black/20"
                >
                    <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 stroke-[3]" />
                    <span className="font-bold tracking-tight text-base">{actionLabel}</span>
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
