"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@shadui/button";
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

export default function InputRegistrationTable() {
    const [registration, setRegistrations] = useState<IRegistration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRegistrations = async () => {
        const response = await fetch("/api/database/attendance");
        const data = await response.json();
        setRegistrations(data.data);
    };

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

    const handleRefresh = () => {
        fetchRegistrations();
    };

    const handleChanges = (index: number, key: string, new_value: string) => {
        setRegistrations((prev) => {
            const updatedEvents = [...prev];
            // @ts-ignore
            updatedEvents[index] = {
                ...updatedEvents[index],
                [key]: new_value,
            };
            return updatedEvents;
        });
    };

    if (loading) return <Loading />;
    return (
        <>
            <span className="gap-4 flex text-lg py-4 ">
                <Button
                    className="font-semibold"
                    onClick={() => {
                        handleRefresh;
                    }}
                >
                    Refresh
                </Button>
                <Button className="font-semibold">Update</Button>
            </span>
            <Table className="text-left max-h-screen overflow-y-scroll">
                <TableHeader>
                    <TableRow className="border border-b-[1px] text-md">
                        <TableCell className="text-center font-bold text-md  border-r-[2px]">
                            Student Name
                        </TableCell>
                        <TableCell className="border-r-[2px]">
                            Registration Number
                        </TableCell>
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
                                    <Input
                                        onChange={(e) =>
                                            handleChanges(
                                                index,
                                                "user_name",
                                                e.target.value,
                                            )
                                        }
                                        value={reg.user_name}
                                        type="text"
                                        className="border-0"
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    <Input
                                        onChange={(e) => {
                                            handleChanges(
                                                index,
                                                "user_reg",
                                                e.target.value,
                                            );
                                        }}
                                        value={reg.user_reg}
                                        type="text"
                                        className="border-0"
                                    />
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
        </>
    );
}
