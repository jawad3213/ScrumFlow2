"use client"

import { ArrowUpDown, MoreHorizontal, Mail, Phone, MapPin, ExternalLink, Trash2, Edit2, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BASE_URL } from '@/utils/api';

const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRandomColor = (name) => {
    if (!name) return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    const colors = [
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-purple-100 text-purple-700 border-purple-200',
        'bg-emerald-100 text-emerald-700 border-emerald-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-rose-100 text-rose-700 border-rose-200',
        'bg-indigo-100 text-indigo-700 border-indigo-200'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="px-1">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorFn: row => `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent -ml-3 h-8 text-neutral-500 font-semibold justify-start text-left"
                >
                    Employee
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("name") || "Unknown Member";
            const { email, avatar } = row.original;

            return (
                <div className="flex items-center gap-3">
                    {avatar ? (
                        <img
                            src={`${BASE_URL}/storage/${avatar}`}
                            alt={name}
                            className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                    ) : (
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-bold shadow-sm ${getRandomColor(name)}`}>
                            {getInitials(name)}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 group-hover:text-brand-primary-500 transition-colors cursor-pointer truncate">
                            {name}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider truncate">
                            {email}
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        id: "specialization",
        accessorFn: (row) => row.specialization?.name || "Unassigned",
        header: () => <div className="text-left">Specialization</div>,
        cell: ({ row }) => {
            const specialization = row.getValue("specialization");
            return (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="h-2 w-2 rounded-full bg-brand-primary-500/30" />
                    <span className="capitalize text-neutral-600 font-bold text-sm tracking-tight">{specialization}</span>
                </div>
            );
        },
    },
    {
        id: "level",
        accessorFn: (row) => row.specialization?.level || "N/A",
        header: "Level",
        cell: ({ row }) => {
            const level = row.getValue("level");
            const colors = {
                'Junior': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                'Mid': 'bg-blue-100 text-blue-700 border-blue-200',
                'Senior': 'bg-purple-100 text-purple-700 border-purple-200',
                'Lead': 'bg-amber-100 text-amber-700 border-amber-200',
                'Architect': 'bg-rose-100 text-rose-700 border-rose-200'
            };
            // Helper to match partial/case-insensitive if needed, or just use strict map
            // Assuming backend sends Title Case usually.
            const colorClass = colors[level] || 'bg-neutral-100 text-neutral-600 border-neutral-200';

            return (
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-xs font-bold ${colorClass} shadow-sm`}>
                    {level}
                </div>
            );
        },
    },

    {
        accessorKey: "is_engaged",
        header: () => <div className="text-right pr-4">Engagement</div>,
        cell: ({ row }) => {
            const isEngaged = !!row.getValue("is_engaged");

            return (
                <div className="flex items-center justify-end pr-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-black border gap-1.5 shadow-subtle ${isEngaged
                        ? 'bg-brand-primary-50 text-brand-primary-700 border-brand-primary-100'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                        }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${isEngaged ? 'bg-brand-primary-500' : 'bg-neutral-400'}`} />
                        <span className="uppercase tracking-widest">{isEngaged ? 'Engaged' : 'Available'}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: ({ row, table }) => {
            const member = row.original

            return (
                <div className="flex items-center justify-end gap-2 pr-4 whitespace-nowrap">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-brand-primary-50 hover:text-brand-primary-600 transition-all duration-200 group"
                        onClick={() => table.options.meta?.onEdit(member)}
                    >
                        <Edit2 className="h-5 w-5 stroke-[2.5]" />
                        <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-danger-lighter hover:text-danger-default transition-all duration-200 group"
                        onClick={() => table.options.meta?.onDelete(member)}
                    >
                        <Trash2 className="h-5 w-5 stroke-[2.5]" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            )
        },
    },
]

