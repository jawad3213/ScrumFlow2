import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { updateSpecialization } from '@/api';
import { isEmpty } from '@/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EditSpecializationModal = ({ specialization, open, onOpenChange, onSpecializationUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        salary: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (specialization) {
            setFormData({
                name: specialization.name || '',
                level: specialization.level || '',
                salary: specialization.salary || ''
            });
        }
    }, [specialization]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (isEmpty(formData.name)) {
            setError('Role name is required.');
            return;
        }

        if (!formData.level) {
            setError('Please select a level.');
            return;
        }

        if (isEmpty(formData.salary) || parseFloat(formData.salary) <= 0) {
            setError('Please enter a valid salary amount.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await updateSpecialization(specialization.id, formData);
            onSpecializationUpdated();
            onOpenChange(false);
        } catch (error) {
            setError(error || "Failed to update specialization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-2xl p-0 border-surface-border shadow-modal overflow-hidden bg-white animate-in zoom-in-95 duration-default ease-soft">
                <div className="bg-surface-background p-8 border-b border-surface-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight">Edit Role</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium">
                            Update the details for this specialization.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-700 pl-1">Role Name</label>
                            <Input
                                required
                                placeholder="e.g. Frontend Developer"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-700 pl-1">Level</label>
                            <Select
                                required
                                value={formData.level}
                                onValueChange={(value) => setFormData({ ...formData, level: value })}
                            >
                                <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Junior">Junior</SelectItem>
                                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                    <SelectItem value="Lead / Architect">Lead / Architect</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Base Salary (per month)</label>
                                <div className="flex items-center gap-2 group bg-surface-background px-4 h-12 rounded-xl border border-surface-border focus-within:border-brand-primary-500 transition-all shadow-subtle">
                                    <span className="text-sm font-bold text-neutral-400 group-focus-within:text-brand-primary-500">MAD</span>
                                    <input
                                        type="number"
                                        required
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        className="flex-1 text-sm font-black text-neutral-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                        placeholder="0.00"
                                    />
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">/ month</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="1000"
                                    max="50000"
                                    step="100"
                                    value={formData.salary || 1000}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-300 ${(formData.salary || 0) < 15000 ? 'accent-success-default' : (formData.salary || 0) < 35000 ? 'accent-brand-primary-500' : 'accent-danger-default'}`}
                                    style={{
                                        background: `linear-gradient(to right, ${(formData.salary || 0) < 15000 ? '#10b981' : (formData.salary || 0) < 35000 ? '#6366f1' : '#f43f5e'} ${((formData.salary || 1000) - 1000) / (50000 - 1000) * 100}%, #f1f5f9 ${((formData.salary || 1000) - 1000) / (50000 - 1000) * 100}%)`
                                    }}
                                />
                                <div className="flex justify-between items-center px-1">
                                    <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${(formData.salary || 0) < 15000 ? 'text-success-default' : (formData.salary || 0) < 35000 ? 'text-brand-primary-500' : 'text-danger-default'}`}>
                                        {(formData.salary || 0) < 15000 ? 'Within Budget' : (formData.salary || 0) < 35000 ? 'Stretching Budget' : 'Above Market Average'}
                                    </span>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">50,000 MAD Cap</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                disabled={loading}
                                className="px-8 min-w-[150px] font-bold"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditSpecializationModal;
