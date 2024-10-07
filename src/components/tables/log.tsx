"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Loading from "../Loading";

interface LogTable {
    id: String;
    action: String;
    timestamp: Date;
    userId: String;
    message: String;
}

const parseDate = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Kolkata",
    }).format(date);

    return formattedDate;
};

export default function LogsTable() {
    const [logs, setLogs] = useState<LogTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const response = await fetch("/api/database/log");
            const data = await response.json();
            setLogs(data.data);
            localStorage.setItem("data", JSON.stringify(data.data));
        };
        const fetchDataInterval = setInterval(() => {
            fetchLogs();
        }, 3000);
        setLoading(false);
        return () => clearInterval(fetchDataInterval);
    }, []);

    if (loading) return <Loading />;

    return (
        <Table className="text-left max-h-screen overflow-y-scroll">
            <TableHeader>
                <TableRow className="border border-b-[1px] text-md">
                    <TableCell className="text-center font-semibold text-md  border-r-[2px]">
                        Action
                    </TableCell>
                    <TableCell className="text-center font-semibold text-md  border-r-[2px]">
                        Timestamp
                    </TableCell>
                    <TableCell className="text-center font-semibold text-md  border-r-[2px]">
                        User ID
                    </TableCell>
                    <TableCell className="text-center font-semibold text-md  border-r-[2px]">
                        Message
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logs.map((log, index) => (
                    <TableRow key={index} className="border border-b-[1px]">
                        <TableCell className="text-center font-normal text-md  border-r-[2px]">
                            {log.action}
                        </TableCell>
                        <TableCell className="text-center font-normal text-md  border-r-[2px]">
                            {parseDate(new Date(log.timestamp))}
                        </TableCell>
                        <TableCell className="text-center font-normal text-md  border-r-[2px]">
                            {log.userId}
                        </TableCell>
                        <TableCell className="text-center font-normal text-md  border-r-[2px]">
                            {log.message}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
