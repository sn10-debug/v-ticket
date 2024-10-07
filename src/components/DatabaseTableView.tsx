"use client";

import { Button } from "@shadui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shadui/select";
import EventsTable from "@vibrance/components/tables/events";
import TimesTable from "@vibrance/components/tables/intime";
import RegistrationTable from "@vibrance/components/tables/registration";
import StudentsTable from "@vibrance/components/tables/students";
import LogsTable from "@vibrance/components/tables/log";
import { csvFormat } from "d3";

import { useState } from "react";

export default function DatabaseTable() {
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
            name: "Logs",
            url: "log",
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

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
    };

    const downloadAsCSV = () => {
        let data = JSON.parse(localStorage.getItem("data") || "[]");
        const csvContent = csvFormat(data);
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "event_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const HandleTables = () => {
        if (selectedValue === "user") {
            return <StudentsTable />;
        } else if (selectedValue === "events") {
            return <EventsTable />;
        } else if (selectedValue === "InTime") {
            return <TimesTable />;
        } else if (selectedValue === "attendance") {
            return <RegistrationTable />;
        } else if (selectedValue === "log") {
            return <LogsTable />;
        }
    };

    return (
        <section className="grid grid-cols-10 gap-4 px-4">
            <section className="col-start-2 col-span-8 py-2">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    View data
                </h1>
                <section className="flex items-center justify-between w-full py-4">
                    <h3 className="font-regular tracking-tighter text-lg border rounded">
                        <Button onClick={downloadAsCSV}>Download as CSV</Button>
                    </h3>

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
                </section>
                <section className="max-h-screen max-w-screen overflow-x-scroll overflow-y-scroll">
                    <HandleTables />
                </section>
            </section>
        </section>
    );
}
