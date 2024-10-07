"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@shadui/button";
import Loading from "@vibrance/components/Loading";
import { useEffect, useState } from "react";

interface EventsTable {
    name: string;
    description: string;
    venue: string;
    date: string;
}

const parseDate = (date: Date): string => {
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

export default function InputEventsTable() {
    const [events, setEvents] = useState<EventsTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchStudents = async () => {
        const response = await fetch("/api/database/events");
        const data = await response.json();
        setEvents(data.data);
    };

    const handleRefresh = async () => {
        fetchStudents();
    };

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch("/api/database/events");
            const data = await response.json();
            setEvents(data.data);
            localStorage.setItem("data", JSON.stringify(data.data));
        };
        fetchStudents();
        setLoading(false);
    }, []);

    const handleChanges = (index: number, key: string, new_value: string) => {
        setEvents((prev) => {
            const updatedEvents = [...prev];
            // @ts-ignore
            updatedEvents[index] = {
                ...updatedEvents[index],
                [key]: new_value,
            };
            return updatedEvents;
        });
    };

    const updateData = () => {};

    if (loading) return <Loading />;

    return (
        <>
            <span className="gap-4 flex text-lg py-4">
                <Button className="font-semibold" onClick={handleRefresh}>
                    Refresh
                </Button>
                <Button className="font-semibold" onClick={updateData}>
                    Update
                </Button>
            </span>
            <Table className="text-left max-h-screen overflow-y-scroll">
                <TableHeader>
                    <TableRow className="border border-b-[1px] text-md">
                        <TableCell className="text-center font-bold text-md  border-r-[2px]">
                            Name
                        </TableCell>
                        <TableCell className="border-r-[2px]">
                            <section className="text-center font-bold">
                                Description
                            </section>
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
                                    <Input
                                        onChange={(e) =>
                                            handleChanges(index, "name", e.target.value)
                                        }
                                        value={event.name}
                                        type="text"
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    <Input value={event.description} type="text" />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    <Input value={event.venue} type="text" />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    <Input
                                        value={parseDate(new Date(event.date))}
                                        type="text"
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
