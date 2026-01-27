"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";
import { Card } from "@workspace/ui/components/card";
import type { z } from "zod";
import type { createScheduleRowSchema } from "../../schema/schema";

interface ScheduleListProps {
    data: z.infer<typeof createScheduleRowSchema>[];
}

const columns: ColumnDef<z.infer<typeof createScheduleRowSchema>>[] = [
    {
        accessorKey: "courseCode",
        header: "Course Code",
    },
    {
        accessorKey: "roomCode",
        header: "Room Code",
    },
    {
        accessorKey: "dayOfWeek",
        header: "Day",
    },
    {
        accessorKey: "sessionType",
        header: "Session Type",
    },
    {
        accessorKey: "period",
        header: "Period",
    },
    {
        accessorKey: "effectiveFrom",
        header: "Effective From",
        cell: ({ row }) => {
            const date = row.original.effectiveFrom;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
    {
        accessorKey: "effectiveTo",
        header: "Effective To",
        cell: ({ row }) => {
            const date = row.original.effectiveTo;
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
];

export const ScheduleList = ({ data }: ScheduleListProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-3 text-sm"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                    No schedules to display
                </div>
            )}
        </Card>
    );
};
