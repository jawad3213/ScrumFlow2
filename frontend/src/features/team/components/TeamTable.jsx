import React, { useState, forwardRef, useImperativeHandle, useRef, useMemo, useCallback, useEffect } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { columns } from './columns';
import EditEmployeeModal from './EditEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import BulkDeleteModal from '@/components/shared/BulkDeleteModal';
import { deleteEmployee, bulkDeleteEmployees } from '@/features/team/api/employees';

const TeamTable = forwardRef(({ data, specializations, onRefresh, onSelectionChange }, ref) => {
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
            await deleteEmployee(id);
            onRefresh();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Delete error:", error);
            alert(error || "An error occurred while deleting");
        }
    };

    const handleBulkDeleteConfirm = async () => {
        try {
            const ids = selectedRowsForBulk.map(row => row.original.id);
            await bulkDeleteEmployees(ids);
            onRefresh();
            setIsBulkDeleteModalOpen(false);
        } catch (error) {
            console.error("Bulk delete error:", error);
            alert(error || "An error occurred while deleting selected employees");
        }
    };

    const [specFilter, setSpecFilter] = useState('All');
    const uniqueRoles = ['All', ...new Set((specializations || []).map(s => s.name))].filter(role =>
        role !== 'Software Architect' && role !== 'Software Architecture' && role !== 'QA Tester'
    );

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

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const filteredData = (data || []).filter(emp => {
        const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
        const matchesSpec = specFilter === 'All' || emp.specialization?.name === specFilter;
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch && matchesSpec;
    });

    return (
        <>
            <div className="space-y-6">
                {/* Specialization Chips Filter */}
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
                                onClick={() => setSpecFilter(role)}
                                className={`
                                px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200
                                ${specFilter === role
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
                <ConfirmDeleteModal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    onConfirm={() => handleDeleteConfirm(deletingEmployee?.id)}
                    title="Delete Member?"
                    description={
                        <span>
                            This action cannot be undone. This will permanently delete <strong>{deletingEmployee?.name}</strong> and remove their data from our servers.
                        </span>
                    }
                    confirmText="Confirm Deletion"
                    cancelText="Keep User"
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
