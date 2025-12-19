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

const AddEmployeeModal = ({ onEmployeeAdded }) => {
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
                <button className="inline-flex items-center justify-center rounded-[20px] text-[16px] font-bold transition-all hover:scale-105 active:scale-95 bg-[#feaa09] text-white shadow-lg shadow-[#feaa09]/30 h-[60px] px-8 py-4 gap-2">
                    <Plus className="h-5 w-5 stroke-[3]" />
                    Add Member
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[30px] p-8 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black text-neutral-900">Add New Team Member</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium">
                        Enter details to create a new employee account. They will receive an email with their credentials.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">Employee Created!</h3>
                        <p className="text-neutral-500 text-center">The welcome email has been sent successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">First Name</label>
                                <Input
                                    required
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-brand-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Last Name</label>
                                <Input
                                    required
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-brand-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Email Address</label>
                            <Input
                                required
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 rounded-xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-brand-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Specialization</label>
                            <select
                                required
                                value={formData.specialization_id}
                                onChange={(e) => setFormData({ ...formData, specialization_id: e.target.value })}
                                className="w-full h-12 rounded-xl border border-neutral-100 bg-neutral-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#feaa09] focus:bg-white transition-all appearance-none cursor-pointer"
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
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-neutral-50 -mx-8 px-8">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="rounded-xl font-bold text-neutral-500"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#feaa09] hover:bg-[#e59908] text-white font-bold px-8 shadow-lg shadow-[#feaa09]/30"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Employee
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddEmployeeModal;
