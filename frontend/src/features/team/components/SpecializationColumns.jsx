import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const specializationColumns = [
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
                    Role Name
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-bold text-neutral-900">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => {
            const level = row.getValue("level");
            let badgeColor = "bg-neutral-100 text-neutral-700";

            // Map keywords to colors
            const levelStr = level.toLowerCase();
            if (levelStr.includes('architect') || levelStr.includes('principal') || levelStr.includes('portfolio')) {
                badgeColor = "bg-indigo-100 text-indigo-700";
            } else if (levelStr.includes('staff') || levelStr.includes('lead') || levelStr.includes('program')) {
                badgeColor = "bg-purple-100 text-purple-700";
            } else if (levelStr.includes('senior')) {
                badgeColor = "bg-blue-100 text-blue-700 font-black";
            } else if (levelStr.includes('mid') || levelStr.includes('manager') || levelStr.includes('sde')) {
                badgeColor = "bg-emerald-100 text-emerald-700";
            } else if (levelStr.includes('junior')) {
                badgeColor = "bg-teal-50 text-teal-600";
            } else if (levelStr.includes('intern')) {
                badgeColor = "bg-amber-50 text-amber-600 border border-amber-200";
            } else {
                badgeColor = "bg-neutral-50 text-neutral-500 border border-neutral-200";
            }

            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                    {level}
                </span>
            );
        },
    },
    {
        accessorKey: "salary",
        header: "Base Salary",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("salary"));
            const formatted = new Intl.NumberFormat("fr-MA", {
                style: "currency",
                currency: "MAD",
                minimumFractionDigits: 2
            }).format(amount);

            return <div className="font-medium text-neutral-600">{formatted}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: ({ row, table }) => {
            const spec = row.original;
            return (
                <div className="flex items-center justify-end gap-2 pr-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onEdit?.(spec)}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-brand-primary-50 hover:text-brand-primary-600 transition-all duration-200 group"
                    >
                        <Edit2 className="h-5 w-5 stroke-[2.5]" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onDelete?.(spec)}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-danger-lighter hover:text-danger-default transition-all duration-200 group"
                    >
                        <Trash2 className="h-5 w-5 stroke-[2.5]" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            )
        },
    },
]
