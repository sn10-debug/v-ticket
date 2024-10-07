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

interface IRegistration {
    attendance_id: string;
    event_date: string;
    event_name: string;
    user_name: string;
    user_reg: string;
}

const parseDate = (date: Date): String => {
    const utcDate = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
        ),
    );

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Kolkata",
    }).format(utcDate);
    return formattedDate;
};

export default function RegistrationTable() {
    const [registration, setRegistrations] = useState<IRegistration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            const response = await fetch("/api/database/attendance");
            const data = await response.json();
            setRegistrations(data.data);
            localStorage.setItem("registrationsData", JSON.stringify(data.data));
        };
        fetchRegistrations();
        const fetchRegistrationsInterval = setInterval(() => {
            fetchRegistrations();
        }, 2000);
        setLoading(false);
        return () => clearInterval(fetchRegistrationsInterval);
    }, []);

    if (loading) return <Loading />;
    return (
        <Table className="text-left max-h-screen overflow-y-scroll">
            <TableHeader>
                <TableRow className="border border-b-[1px] text-md">
                    <TableCell className="text-center font-bold text-md  border-r-[2px]">
                        Student Name
                    </TableCell>
                    <TableCell className="border-r-[2px]">Registration Number</TableCell>
                    <TableCell className="font-bold text-md  border-r-[2px] text-center">
                        Event Name
                    </TableCell>
                    <TableCell className="font-bold text-md  border-r-[2px] text-center">
                        Event Date
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <Skeleton className="h-4 w-full rounded bg-slate-[2px]00" />
                ) : (
                    registration.map((reg: IRegistration, index) => (
                        <TableRow key={index} className="font-normal text-sm">
                            <TableCell className="border-l-[2px] border-r-[2px] text-center">
                                {reg.user_name}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {reg.user_reg}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {reg.event_name}
                            </TableCell>
                            <TableCell className="border-r-[2px] text-center">
                                {parseDate(new Date(reg.event_date))}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
