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
import Loading from "@vibrance/components/Loading";

interface EventsTable {
    name: string;
    description: string;
    venue: string;
    date: string;
}

const parseDate = (date: Date): String => {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
    }).format(date);

    return formattedDate;
};

export default function EventsTable() {
    const [events, setEvents] = useState<EventsTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch("/api/database/events");
            const data = await response.json();
            setEvents(data.data);
            localStorage.setItem("data", JSON.stringify(data.data));
        };
        const fetchDataInterval = setInterval(() => {
            fetchStudents();
        }, 2000);
        setLoading(false);
        return () => clearInterval(fetchDataInterval);
    }, []);

    if (loading) return <Loading />;

    return (
        <Table className="text-left max-h-screen overflow-y-scroll">
            <TableHeader>
                <TableRow className="border border-b-[1px] text-md">
                    <TableCell className="text-center font-bold text-md  border-r-[2px]">
                        Name
                    </TableCell>
                    <TableCell className="border-r-[2px]">
                        <section className="text-center font-bold">Description</section>
                    </TableCell>
                    <TableCell className="font-bold text-md  border-r-[2px] text-center">
                        Venue
                    </TableCell>
                    <TableCell className="font-bold text-md  border-r-[2px] text-center">
                        Date
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <Skeleton className="h-4 w-full rounded bg-slate-[2px]00" />
                ) : (
                    events.map((event: EventsTable, index) => (
                        <TableRow key={index} className="font-normal text-sm">
                            <TableCell className="border-l-[2px] border-r-[2px] text-center">
                                {event.name}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {event.description}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {event.venue}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {parseDate(new Date(event.date))}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
