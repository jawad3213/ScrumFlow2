import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { createSpecialization } from '@/api';
import { isEmpty } from '@/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ROLE_LEVELS, ALL_ROLES } from '@/utils/constants';

const AddSpecializationModal = ({ onSpecializationAdded, variant = "default" }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        salary: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const availableLevels = formData.name ? ROLE_LEVELS[formData.name] || [] : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (!formData.name) {
            setError('Please select a role.');
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
        try {
            await createSpecialization(formData);
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                setFormData({ name: '', level: '', salary: '' });
                if (onSpecializationAdded) onSpecializationAdded();
            }, 2000);
        } catch (error) {
            console.error(error);
            setError(error || "Failed to create specialization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size="lg" className="rounded-xl h-11 px-6 gap-2 group font-bold tracking-tight">
                    <Plus className="h-4 w-4 stroke-[3] group-hover:rotate-90 transition-transform duration-default" />
                    <span>Add Role</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-2xl p-0 border-surface-border shadow-modal overflow-hidden bg-white animate-in zoom-in-95 duration-default ease-soft">
                <div className="bg-surface-background p-8 border-b border-surface-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight">Add New Role</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium">
                            Define a new specialization role and its details.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in-95 duration-default">
                            <div className="h-20 w-20 rounded-full bg-success-lighter flex items-center justify-center border border-success-default/20">
                                <CheckCircle2 className="h-10 w-10 text-success-default" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-neutral-900">Role Created!</h3>
                                <p className="text-neutral-500 font-medium mt-1">The new specialization has been added successfully.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Role Name</label>
                                <Select
                                    required
                                    value={formData.name}
                                    onValueChange={(value) => setFormData({ ...formData, name: value, level: '' })}
                                >
                                    <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_ROLES.map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Level</label>
                                <Select
                                    required
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                    disabled={!formData.name}
                                >
                                    <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableLevels.map(lvl => (
                                            <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                                        ))}
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
                                    onClick={() => setOpen(false)}
                                    className="font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant={variant}
                                    disabled={loading}
                                    className="px-8 min-w-[150px] font-bold"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Create Role"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddSpecializationModal;
