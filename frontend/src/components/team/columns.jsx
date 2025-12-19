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

const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const getRandomColor = (name) => {
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent -ml-3 h-8 text-neutral-500 font-semibold"
                >
                    Employee
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("name");
            const email = row.original.email;

            return (
                <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-semibold ${getRandomColor(name)}`}>
                        {getInitials(name)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 group-hover:text-brand-primary transition-colors cursor-pointer">
                            {name}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">
                            {email}
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Specialization",
        cell: ({ row }) => {
            const role = row.getValue("role");
            return (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary/40" />
                    <span className="capitalize text-neutral-700 font-medium">{role}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "rate",
        header: ({ column }) => {
            return (
                <div className="text-right w-full pr-4">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-transparent -mr-3 h-8 text-neutral-500 font-semibold inline-flex"
                    >
                        Daily Rate
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="text-right font-semibold text-neutral-700 pr-4">
                {row.getValue("rate")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") || "Unknown";

            const getStatusStyles = (status) => {
                const normalized = status.toLowerCase();
                if (normalized === 'active') return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    dot: 'bg-emerald-500'
                };
                if (normalized === 'on leave' || normalized === 'pending') return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    dot: 'bg-amber-500'
                };
                if (normalized === 'banned' || normalized === 'terminated') return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-200',
                    dot: 'bg-rose-500'
                };
                return {
                    bg: 'bg-neutral-50',
                    text: 'text-neutral-700',
                    border: 'border-neutral-200',
                    dot: 'bg-neutral-500'
                };
            };

            const styles = getStatusStyles(status);

            return (
                <div className="flex items-center">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.bg} ${styles.text} ${styles.border} gap-1.5 shadow-sm`}>
                        {status.toLowerCase() === 'active' ? (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                        ) : (
                            <div className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                        )}
                        <span className="uppercase tracking-wider text-[10px]">{status}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const member = row.original

            return (
                <div className="flex items-center justify-end pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-full transition-all">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] p-1.5 animate-in slide-in-from-top-1 duration-200">
                            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                Manage Employee
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="-mx-1.5 my-1" />
                            <DropdownMenuItem className="gap-2 focus:bg-brand-primary/5 focus:text-brand-primary cursor-pointer rounded-md">
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 focus:bg-brand-primary/5 focus:text-brand-primary cursor-pointer rounded-md">
                                <Shield className="h-3.5 w-3.5" />
                                Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 focus:bg-brand-primary/5 focus:text-brand-primary cursor-pointer rounded-md"
                                onClick={() => {
                                    window.location.href = `mailto:${member.email}`;
                                }}
                            >
                                <Mail className="h-3.5 w-3.5" />
                                Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="-mx-1.5 my-1" />
                            <DropdownMenuItem className="gap-2 group text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer rounded-md">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

