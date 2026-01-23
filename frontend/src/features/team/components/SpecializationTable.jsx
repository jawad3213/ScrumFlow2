import React, { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useRef, useEffect } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { specializationColumns } from './SpecializationColumns';
import { Database, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import EditSpecializationModal from './EditSpecializationModal';
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal';
import BulkDeleteModal from '@/components/shared/BulkDeleteModal';
import { bulkDeleteSpecializations, deleteSpecialization } from '@/features/team/api/specializations';

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
            const ids = selectedRowsForBulk.map(row => row.original.id);
            await bulkDeleteSpecializations(ids);
            onRefresh();
            setIsBulkDeleteModalOpen(false);
        } catch (error) {
            console.error("Bulk delete error:", error);
            alert(error || "An error occurred while deleting selected specializations");
        }
    };

    const [selectedFilter, setSelectedFilter] = useState('All');

    const uniqueRoles = ['All', ...new Set((data || []).map(item => item.name))].filter(role =>
        role !== 'Software Architect' && role !== 'Software Architecture' && role !== 'QA Tester'
    );

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

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    }, []);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [checkScroll, uniqueRoles]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="relative flex items-center group/filter px-1">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 z-10 p-2 rounded-full bg-white border border-surface-border shadow-modal text-neutral-400 hover:text-brand-primary-500 hover:border-brand-primary-200 transition-all -translate-x-1/2"
                        >
                            <ChevronLeft className="h-4 w-4 stroke-[3]" />
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none w-full scroll-smooth"
                    >
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

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 z-10 p-2 rounded-full bg-white border border-surface-border shadow-modal text-neutral-400 hover:text-brand-primary-500 hover:border-brand-primary-200 transition-all translate-x-1/2"
                        >
                            <ChevronRight className="h-4 w-4 stroke-[3]" />
                        </button>
                    )}
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
                <ConfirmDeleteModal
                    open={!!deletingSpec}
                    onOpenChange={(open) => !open && setDeletingSpec(null)}
                    onConfirm={async () => {
                        await deleteSpecialization(deletingSpec.id);
                        onRefresh();
                    }}
                    title="Delete Role?"
                    description={
                        <span>
                            This action cannot be undone. You are deleting <span className="font-bold text-neutral-900">{deletingSpec?.name} ({deletingSpec?.level})</span>. This may affect assigned team members.
                        </span>
                    }
                    confirmText="Confirm Deletion"
                    cancelText="Keep Role"
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
