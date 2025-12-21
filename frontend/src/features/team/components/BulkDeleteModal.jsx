import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";

const BulkDeleteModal = ({ open, onOpenChange, onConfirm, count, type = "items" }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error("Error during bulk delete:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-3xl border-surface-border shadow-modal bg-white p-0 overflow-hidden max-w-md animate-in zoom-in-95 duration-300">
                <div className="bg-danger-lighter/30 p-8 border-b border-danger-default/10 flex flex-col items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-danger-lighter flex items-center justify-center border-4 border-white shadow-subtle mb-4">
                        <Trash2 className="h-10 w-10 text-danger-default" />
                    </div>
                    <AlertDialogHeader className="text-center">
                        <AlertDialogTitle className="text-2xl font-black text-neutral-900 tracking-tight text-center">
                            Delete {count} {type}?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-500 font-medium text-center mt-2 max-w-xs mx-auto">
                            You are about to permanently delete <strong>{count}</strong> selected {type}. This action cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                <div className="p-6 flex flex-col gap-3">
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="w-full h-14 font-black bg-danger-default hover:bg-danger-darker text-white rounded-2xl shadow-lg shadow-danger-default/20 transition-all active:scale-[0.98] border-none"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            `Delete ${count} ${type}`
                        )}
                    </AlertDialogAction>
                    <AlertDialogCancel
                        disabled={loading}
                        className="w-full h-12 font-bold text-neutral-600 hover:bg-neutral-50 rounded-xl border-none shadow-none"
                    >
                        Cancel
                    </AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BulkDeleteModal;
