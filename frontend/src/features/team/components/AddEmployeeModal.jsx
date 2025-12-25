import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { getSpecializations, createEmployee } from '@/api';
import { isValidEmail, isEmpty } from '@/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LEVEL_ORDER } from '@/constants/roles';

const AddEmployeeModal = ({ onEmployeeAdded, variant = "default", open: controlledOpen, onOpenChange: setControlledOpen, showTrigger = true }) => {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        specialization_name: '',
        level: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (open) {
            fetchSpecializations();
        }
    }, [open]);

    const fetchSpecializations = async () => {
        try {
            const data = await getSpecializations();
            setSpecializations(data);
        } catch (error) {
            console.error("Error fetching specializations:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Client-side Validations
        if (isEmpty(formData.first_name) || isEmpty(formData.last_name)) {
            setError('First and last name are required.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!formData.specialization_name || !formData.level) {
            setError('Please select both a specialization and a level.');
            return;
        }

        setLoading(true);
        try {
            await createEmployee(formData);
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                setFormData({ first_name: '', last_name: '', email: '', specialization_name: '', level: '' });
                if (onEmployeeAdded) onEmployeeAdded();
            }, 2000);
        } catch (error) {
            setError(error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant={variant} size="lg" className="rounded-xl h-11 px-6 gap-2 group font-bold tracking-tight">
                        <Plus className="h-4 w-4 stroke-[3] group-hover:rotate-90 transition-transform duration-default" />
                        <span>Add Member</span>
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 border-surface-border shadow-modal overflow-hidden bg-white animate-in zoom-in-95 duration-default ease-soft">
                <div className="bg-surface-background p-8 border-b border-surface-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight">Add New Team Member</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium">
                            Enter details to create a new employee account. They will receive an email with their credentials.
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
                                <h3 className="text-xl font-bold text-neutral-900">Employee Created!</h3>
                                <p className="text-neutral-500 font-medium mt-1">The welcome email has been sent successfully.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-neutral-700 pl-1">First Name</label>
                                    <Input
                                        required
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-neutral-700 pl-1">Last Name</label>
                                    <Input
                                        required
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Email Address</label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-neutral-700 pl-1">Specialization</label>
                                    <Select
                                        required
                                        value={formData.specialization_name}
                                        onValueChange={(value) => setFormData({ ...formData, specialization_name: value, level: '' })}
                                    >
                                        <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...new Set(specializations.map(s => s.name))].map((name) => (
                                                <SelectItem key={name} value={name}>
                                                    {name}
                                                </SelectItem>
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
                                        disabled={!formData.specialization_name}
                                    >
                                        <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(() => {
                                                const filteredLevels = [...new Set(specializations
                                                    .filter(s => s.name === formData.specialization_name)
                                                    .map(s => s.level))];

                                                return filteredLevels
                                                    .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))
                                                    .map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ));
                                            })()}
                                        </SelectContent>
                                    </Select>
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
                                        "Create Employee"
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

export default AddEmployeeModal;
