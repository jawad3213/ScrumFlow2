import React, { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { DataTable } from './data-table';
import { specializationColumns } from './SpecializationColumns';
import { Database } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import EditSpecializationModal from './EditSpecializationModal';
import DeleteSpecializationModal from './DeleteSpecializationModal';
import BulkDeleteModal from './BulkDeleteModal';

const SpecializationTable = forwardRef(({ data, onRefresh, onSelectionChange }, ref) => {
    const [editingSpec, setEditingSpec] = useState(null);
    const [deletingSpec, setDeletingSpec] = useState(null);
    const [selectedRowsForBulk, setSelectedRowsForBulk] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        triggerBulkDelete: () => {
            if (selectedRowsForBulk.length > 0) {
                setIsBulkDeleteModalOpen(true);
            }
        }
    }));

    const handleEdit = (spec) => {
        setEditingSpec(spec);
    };

    const handleDelete = (spec) => {
        setDeletingSpec(spec);
    };

    const handleBulkDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const ids = selectedRowsForBulk.map(row => row.original.id);
            const response = await fetch('http://localhost:8000/api/specializations/bulk-delete', {
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
                alert("Failed to delete selected specializations");
            }
        } catch (error) {
            console.error("Bulk delete error:", error);
            alert("An error occurred while deleting selected specializations");
        }
    };

    const [selectedFilter, setSelectedFilter] = useState('All');

    const uniqueRoles = ['All', ...new Set((data || []).map(item => item.name))];

    const handleTableSelectionChange = useCallback((rows) => {
        setSelectedRowsForBulk(rows);
        onSelectionChange?.(rows);
    }, [onSelectionChange]);

    const tableMeta = useMemo(() => ({
        onEdit: handleEdit,
        onDelete: handleDelete
    }), [handleEdit, handleDelete]);

    const filteredData = selectedFilter === 'All'
        ? (data || [])
        : (data || []).filter(item => item.name === selectedFilter);

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
                        {uniqueRoles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedFilter(role)}
                                className={`
                                px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200
                                ${selectedFilter === role
                                        ? 'bg-brand-primary-500 text-white shadow-md transform scale-105'
                                        : 'bg-white text-neutral-600 border border-surface-border hover:border-brand-primary-200 hover:text-brand-primary-600 hover:bg-brand-primary-50'}
                            `}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <DataTable
                    columns={specializationColumns}
                    data={filteredData}
                    onSelectionChange={handleTableSelectionChange}
                    meta={tableMeta}
                    emptyState={
                        <EmptyState
                            icon={Database}
                            title="No specializations found"
                            description="There are no specializations defined yet."
                        />
                    }
                />
            </div>
            {editingSpec && (
                <EditSpecializationModal
                    specialization={editingSpec}
                    open={!!editingSpec}
                    onOpenChange={(open) => !open && setEditingSpec(null)}
                    onSpecializationUpdated={onRefresh}
                />
            )}
            {deletingSpec && (
                <DeleteSpecializationModal
                    specialization={deletingSpec}
                    open={!!deletingSpec}
                    onOpenChange={(open) => !open && setDeletingSpec(null)}
                    onSpecializationDeleted={onRefresh}
                />
            )}
            <BulkDeleteModal
                open={isBulkDeleteModalOpen}
                onOpenChange={setIsBulkDeleteModalOpen}
                count={selectedRowsForBulk.length}
                type="specializations"
                onConfirm={handleBulkDeleteConfirm}
            />
        </>
    );
});

export default SpecializationTable;
