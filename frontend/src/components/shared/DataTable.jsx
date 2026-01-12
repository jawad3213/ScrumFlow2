"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Search, SlidersHorizontal, ChevronLeft, ChevronRight, UserPlus, Database } from "lucide-react"
import EmptyState from "@/components/ui/EmptyState"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function DataTable({
    columns,
    data,
    meta,
    emptyState,
    onSelectionChange,
    bulkActions,
}) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        meta: meta
    })

    // Use a ref for the callback to avoid effect loops from unstable parent callbacks
    const onSelectionChangeRef = React.useRef(onSelectionChange);
    React.useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    }, [onSelectionChange]);

    // Effect to notify parent of selection changes
    React.useEffect(() => {
        if (onSelectionChangeRef.current) {
            onSelectionChangeRef.current(table.getFilteredSelectedRowModel().rows);
        }
    }, [rowSelection]); // Only run when actual selection state changes

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    return (
        <div className="w-full space-y-4">
            {/* Bulk actions bar removed to be handled externally */}
            <div className="rounded-2xl border border-surface-border bg-white shadow-elevation overflow-hidden w-full transition-all duration-500">
                <div className="overflow-x-auto scrollbar-thin">
                    <Table>
                        <TableHeader className="bg-surface-muted/30">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="h-10 py-2 px-2 first:pl-4 last:pr-4 border-b border-surface-border">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="group hover:bg-surface-muted/50 transition-ui duration-default ease-soft border-b border-surface-border last:border-0"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-2.5 px-2 first:pl-4 last:pr-4 align-middle">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-[400px] p-0"
                                    >
                                        {emptyState ? (
                                            emptyState
                                        ) : (
                                            <EmptyState
                                                icon={Database}
                                                title="No results found"
                                                description="Try adjusting your filters or add a new entry to get started."
                                                onAction={meta?.onCreate}
                                                actionLabel="Add New"
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <div className="flex-1 text-sm font-medium text-neutral-500">
                    <span className="text-brand-primary-500 font-bold">{table.getFilteredSelectedRowModel().rows.length}</span> of{" "}
                    <span className="text-neutral-900 font-bold">{table.getFilteredRowModel().rows.length}</span> employee(s) selected.
                </div>

                <div className="flex items-center gap-1.5 bg-surface-muted/50 p-1.5 rounded-xl border border-surface-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 w-8 p-0 hover:bg-white hover:text-brand-primary-500"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-3 text-xs font-bold text-neutral-700">
                        Page <span className="text-brand-primary-500">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 w-8 p-0 hover:bg-white hover:text-brand-primary-500"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
