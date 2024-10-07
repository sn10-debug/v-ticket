import { Skeleton } from "@/components/ui/skeleton";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";

export default function SkeletalTable() {
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">
                            <Skeleton className="h-4 w-full rounded" />
                        </TableHead>
                        <TableHead className="w-[200px]">
                            <Skeleton className="h-4 w-full rounded" />
                        </TableHead>
                        <TableHead className="w-[200px]">
                            <Skeleton className="h-4 w-full rounded" />
                        </TableHead>
                        <TableHead className="w-[200px]">
                            <Skeleton className="h-4 w-full rounded" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-full rounded" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
