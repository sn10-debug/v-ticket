"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shadui/select";

interface StudentTable {
    reg_no: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    broken: boolean;
    year: string;
    branch: string;
    paidStatus: boolean;
}

export default function EditTable() {
    const [students, setStudents] = useState<StudentTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("/api/database/user");
                const data = await response.json();
                setStudents(data.data);
                localStorage.setItem("data", JSON.stringify(data.data));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleSaveChanges = () => {
        console.log("Saving changes:", students);
    };

    const table = [
        {
            name: "Events",
            url: "events",
        },
        {
            name: "Students",
            url: "user",
        },
        {
            name: "Registration",
            url: "attendance",
        },
        {
            name: "In time",
            url: "InTime",
        },
    ];

    const [selectedValue, setSelectedValue] = useState<string>(table[0]?.url!);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
        fetchData();
    };

    const fetchData = async () => {
        let columns: string[] = [];

        if (selectedValue === "user") {
            const fetchStudents = async () => {
                const response = await fetch("/api/database/user");
                const data = await response.json();
                columns = [
                    "Registration Number",
                    "Name",
                    "Hex ID",
                    "Email",
                    "Broken",
                    "Year",
                    "Branch",
                ];
                setData(data.data);
            };
            await fetchStudents();
        } else if (selectedValue === "events") {
            const fetchEvents = async () => {
                const response = await fetch("/api/database/events");
                const data = await response.json();
                columns = ["Name", "Description", "Venue", "Date"];
                setData(data.data);
            };
            await fetchEvents();
        } else if (selectedValue === "InTime") {
            const fetchIntimes = async () => {
                const response = await fetch("/api/database/InTime");
                const data = await response.json();
                columns = ["Registration No", "Name", "Event Name", "Intime"];
                setData(data.data);
            };

            await fetchIntimes();
        } else if (selectedValue === "attendance") {
            const fetchAttendance = async () => {
                const response = await fetch("/api/database/attendance");
                const data = await response.json();
                columns = [
                    "Student Name",
                    "Registration Number",
                    "Event Name",
                    "Event Date",
                ];
                setData(data.data);
            };
            await fetchAttendance();
        }

        setColumns(() => {
            console.log(columns);
            return columns;
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section className="w-full">
            <main className="flex flex-1 flex-col gap-4 ">
                <section className="flex items-center">
                    <h1 className="font-semibold text-lg md:text-2xl">Products</h1>
                    <section className="flex items-center w-full justify-end gap-4">
                        <Select
                            onValueChange={handleValueChange}
                            defaultValue={selectedValue}
                        >
                            <SelectTrigger className="w-[180px] px-3 py-2 tracking-tight font-semibold">
                                <SelectValue placeholder="Select a table" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="w-[180px] p-2 bg-white z-10">
                                    {table.map((item, index) => (
                                        <SelectItem
                                            className="p-2"
                                            value={item.url}
                                            key={index}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button size="sm">Refresh</Button>
                        <Button size="sm" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </section>
                </section>
                <section className="border shadow-sm rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((item, index) => (
                                    <TableCell
                                        className="font-semibold text-lg"
                                        key={index}
                                    >
                                        {item}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Input
                                        className="font-normal w-full"
                                        defaultValue="Glimmer Lamps"
                                        type="text"
                                    />
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Input
                                        className="w-full font-normal"
                                        defaultValue="In Production"
                                        type="text"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        className="w-full font-normal"
                                        defaultValue="500 in stock"
                                        type="text"
                                    />
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Input
                                        className="w-full font-normal"
                                        defaultValue="Luminance Creations"
                                        type="text"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
            </main>
        </section>
    );
}
