import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';

const ConfirmDeleteModal = ({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description,
    confirmText = "Confirm Deletion",
    cancelText = "Cancel",
    loading: externalLoading = false,
    autoClose = true
}) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = externalLoading || internalLoading;

    const handleConfirm = async () => {
        setInternalLoading(true);
        try {
            await onConfirm();
            if (autoClose) {
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Confirmation error:", error);
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 border-surface-border shadow-modal overflow-hidden bg-white animate-in zoom-in-95 duration-default ease-soft">
                <div className="bg-danger-lighter/30 p-8 border-b border-danger-default/10 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-danger-lighter flex items-center justify-center border border-danger-default/20 mb-4">
                        <AlertTriangle className="h-8 w-8 text-danger-default" />
                    </div>
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-xl font-black text-neutral-900 tracking-tight text-center">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium text-center mt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 flex flex-col gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 font-bold text-neutral-600 hover:bg-neutral-50 rounded-xl"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="default"
                        disabled={isLoading}
                        onClick={handleConfirm}
                        className="w-full h-12 font-black bg-danger-default hover:bg-danger-darker text-white rounded-xl shadow-lg shadow-danger-default/20 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
