"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { useMetricLogs } from "../../hooks/use-metrics";
import { MetricLogs } from "../../types";
import { humanizeEnum } from "@/lib/formatters";

const columns: ColumnDef<MetricLogs>[] = [
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
            <Badge variant="outline">{humanizeEnum(row.original.action)}</Badge>
        ),
    },
    {
        accessorKey: "entityType",
        header: "Entity",
        cell: ({ row }) => (
            <Badge variant="outline">
                {humanizeEnum(row.original.entityType)}
            </Badge>
        ),
    },
    {
        accessorKey: "entityId",
        header: "Entity ID",
        cell: ({ row }) =>
            row.original.entityId ?? (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        accessorKey: "actorEmail",
        header: "Actor",
        cell: ({ row }) =>
            row.original.actorEmail ?? (
                <span className="text-muted-foreground">System</span>
            ),
    },
    {
        accessorKey: "createdAt",
        header: "When",
        cell: ({ row }) =>
            formatDistanceToNow(new Date(row.original.createdAt), {
                addSuffix: true,
            }),
    },
];

export const RecentLogs = () => {
    const { data: logs } = useMetricLogs();
    const table = useReactTable({
        data: logs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button
                    variant="outline"
                    size="sm"
                    render={(props) => (
                        <Link {...props} href="/logs">
                            View all logs
                        </Link>
                    )}
                />
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export const RecentLogsSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="outline" size="sm" disabled>
                    View all logs
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((_, i) => (
                                <TableHead key={i}>
                                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, row) => (
                            <TableRow key={row}>
                                {columns.map((_, col) => (
                                    <TableCell key={col}>
                                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
