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

const AddEmployeeModal = ({ onEmployeeAdded, variant = "default" }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        specialization_id: ''
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
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://localhost:8000/api/specializations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSpecializations(data);
            }
        } catch (error) {
            console.error("Error fetching specializations:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://localhost:8000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                    setFormData({ first_name: '', last_name: '', email: '', specialization_id: '' });
                    if (onEmployeeAdded) onEmployeeAdded();
                }, 2000);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (error) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size="lg" className="rounded-xl h-11 px-6 gap-2 group font-bold tracking-tight">
                    <Plus className="h-4 w-4 stroke-[3] group-hover:rotate-90 transition-transform duration-default" />
                    <span>Add Member</span>
                </Button>
            </DialogTrigger>
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
                                <div className="space-y-8">
                                    <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">First Name</label>
                                    <Input
                                        required
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Last Name</label>
                                    <Input
                                        required
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Email Address</label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-8 relative group">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-widest pl-1">Specialization</label>
                                <select
                                    required
                                    value={formData.specialization_id}
                                    onChange={(e) => setFormData({ ...formData, specialization_id: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-surface-border bg-surface-background px-4 text-sm font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:bg-white transition-ui duration-default ease-soft appearance-none cursor-pointer shadow-subtle"
                                >
                                    <option value="" disabled>Select a role</option>
                                    {specializations.map((spec) => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name} ({spec.level})
                                        </option>
                                    ))}
                                </select>
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
