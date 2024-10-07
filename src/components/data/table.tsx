import { Events } from "@prisma/client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@shadui/table";

interface DataTableProps {
    data: Events[];
    columns: string[];
    Icon: JSX.Element;
    route: string;
}

export default function DataTable(props: DataTableProps) {
    const { data, columns, Icon, route } = props;

    return (
        <Table className="w-full text-center">
            <TableHeader className="bg-gray-200/65 text-xl font-semibold tracking-tighter">
                <TableRow>
                    {columns.map((column, index) => (
                        <TableCell key={index} className="px-4 py-2 border rounded-md">
                            {column}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((event, index) => (
                    <TableRow key={index} className="text-md font-medium">
                        <TableCell className="border px-4 py-2">{event.name}</TableCell>
                        <TableCell className="border px-4 py-2">
                            {event.description}
                        </TableCell>
                        <TableCell className="border px-4 py-2">{event.venue}</TableCell>
                        <TableCell className="border px-4 py-2">
                            {new Date(event.date).toDateString()}
                        </TableCell>
                        <TableCell className="border px-4 py-2">
                            <a
                                href={`/super-admin/${route}/${event.id}`}
                                className="flex items-center justify-center w-full text-zinc-500 hover:text-blue-600"
                            >
                                {Icon}
                            </a>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
