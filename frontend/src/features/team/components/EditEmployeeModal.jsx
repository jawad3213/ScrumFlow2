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
import { useUpdateEmployee } from '@/hooks/useEmployeesQuery';
import { useSpecializations } from '@/hooks/useSpecializationsQuery';
import { isEmpty } from '@/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LEVEL_ORDER } from '@/utils/constants';

const EditEmployeeModal = ({ employee, open, onOpenChange, onEmployeeUpdated }) => {
    const { mutate: updateEmployeeMember, isPending: loading } = useUpdateEmployee();
    const { data: specializations = [] } = useSpecializations();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        specialization_name: '',
        level: '',
        status: 'active',
        is_engaged: 'false'
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (employee) {
            setFormData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                specialization_name: employee.specialization?.name || '',
                level: employee.specialization?.level || '',
                status: employee.status || 'active',
                is_engaged: employee.is_engaged ? 'true' : 'false'
            });
        }
    }, [employee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (isEmpty(formData.first_name) || isEmpty(formData.last_name)) {
            setError('First and last name are required.');
            return;
        }

        if (!formData.specialization_name || !formData.level) {
            setError('Please select both a specialization and a level.');
            return;
        }


        setError(null);

        const { email, is_engaged, ...rest } = formData;
        const updateData = {
            ...rest,
            is_engaged: is_engaged === 'true'
        };

        updateEmployeeMember({ id: employee.id, data: updateData }, {
            onSuccess: () => {
                onEmployeeUpdated?.();
                onOpenChange(false);
            },
            onError: (err) => {
                setError(err.message || err || "Something went wrong");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 border-surface-border shadow-modal overflow-hidden bg-white animate-in zoom-in-95 duration-default ease-soft">
                <div className="bg-surface-background p-8 border-b border-surface-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight">Edit Member Profile</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium">
                            Update the information for this team member.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
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
                            <label className="text-sm font-bold text-neutral-700 pl-1">Email Address (Read-only)</label>
                            <Input
                                readOnly
                                type="email"
                                value={formData.email}
                                className="h-12 bg-neutral-50 text-neutral-400 cursor-not-allowed border-none shadow-none font-semibold px-4"
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Account Status</label>
                                <Select
                                    required
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="banned">Banned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-700 pl-1">Engagement Status</label>
                                <Select
                                    required
                                    value={formData.is_engaged}
                                    onValueChange={(value) => setFormData({ ...formData, is_engaged: value })}
                                >
                                    <SelectTrigger className="h-12 border-surface-border bg-surface-background focus:bg-white transition-all font-semibold rounded-xl px-4 text-sm text-neutral-700">
                                        <SelectValue placeholder="Select Engagement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">Available</SelectItem>
                                        <SelectItem value="true">Engaged</SelectItem>
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

export default EditEmployeeModal;
