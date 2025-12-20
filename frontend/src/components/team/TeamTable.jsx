import React, { useState, forwardRef, useImperativeHandle, useRef, useMemo, useCallback } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import { Users, Search } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import BulkDeleteModal from './BulkDeleteModal';

const TeamTable = forwardRef(({ data, onRefresh, onSelectionChange }, ref) => {
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedRowsForBulk, setSelectedRowsForBulk] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        triggerBulkDelete: () => {
            if (selectedRowsForBulk.length > 0) {
                setIsBulkDeleteModalOpen(true);
            }
        }
    }));

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDeleteRequest = (employee) => {
        setDeletingEmployee(employee);
        setIsDeleteModalOpen(true);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleDeleteConfirm = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onRefresh();
                setIsDeleteModalOpen(false);
            } else {
                alert("Failed to delete employee");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting");
        }
    };

    const handleBulkDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const ids = selectedRowsForBulk.map(row => row.original.id);
            const response = await fetch('http://localhost:8000/api/employees/bulk-delete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids })
            });

            if (response.ok) {
                onRefresh();
                setIsBulkDeleteModalOpen(false);
            } else {
                alert("Failed to delete selected employees");
            }
        } catch (error) {
            console.error("Bulk delete error:", error);
            alert("An error occurred while deleting selected employees");
        }
    };

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const handleTableSelectionChange = useCallback((rows) => {
        setSelectedRowsForBulk(rows);
        onSelectionChange?.(rows);
    }, [onSelectionChange]);

    const tableMeta = useMemo(() => ({
        onEdit: handleEdit,
        onDelete: handleDeleteRequest,
        onCreate: handleAdd
    }), [handleEdit, handleDeleteRequest, handleAdd]);

    const filteredData = (data || []).filter(emp => {
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent px-1">
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4.5 w-4.5 text-neutral-400 group-focus-within:text-brand-primary-500 transition-colors duration-200" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full h-11 pl-11 pr-4 bg-white border border-surface-border rounded-xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all duration-200 shadow-subtle"
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-surface-border shadow-subtle self-end sm:self-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${statusFilter === 'all' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${statusFilter === 'active' ? 'bg-success-default text-white shadow-sm' : 'text-neutral-500 hover:text-success-default hover:bg-success-lighter/30'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setStatusFilter('banned')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${statusFilter === 'banned' ? 'bg-danger-default text-white shadow-sm' : 'text-neutral-500 hover:text-danger-default hover:bg-danger-lighter/30'}`}
                        >
                            Banned
                        </button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    onSelectionChange={handleTableSelectionChange}
                    meta={tableMeta}
                    emptyState={
                        <EmptyState
                            icon={Users}
                            title="Your team is empty"
                            description="Start growing your organization by adding your first team member."
                        />
                    }
                />
                {editingEmployee && (
                    <EditEmployeeModal
                        employee={editingEmployee}
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        onEmployeeUpdated={onRefresh}
                    />
                )}
                <DeleteEmployeeModal
                    employee={deletingEmployee}
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    onConfirm={handleDeleteConfirm}
                />
                <AddEmployeeModal
                    open={isAddModalOpen}
                    onOpenChange={setIsAddModalOpen}
                    onEmployeeAdded={onRefresh}
                    showTrigger={false}
                />
                <BulkDeleteModal
                    open={isBulkDeleteModalOpen}
                    onOpenChange={setIsBulkDeleteModalOpen}
                    count={selectedRowsForBulk.length}
                    type="employees"
                    onConfirm={handleBulkDeleteConfirm}
                />
            </div>
        </>
    );
});

export default TeamTable;
