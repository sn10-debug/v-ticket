"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shadui/select";
import InputEventsTable from "@vibrance/components/tables/input/events";
import InputStudentsTable from "@vibrance/components/tables/input/students";

import { useState } from "react";
import InputRegistrationTable from "./tables/input/registration";

export default function InputDatabaseTable() {
    const table = [
        {
            name: "Events",
            url: "events",
        },
        {
            name: "Students",
            url: "user",
        },
    ];

    const [selectedValue, setSelectedValue] = useState<string>(table[0]?.url!);

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
    };

    const HandleTables = () => {
        if (selectedValue === "user") {
            return <InputStudentsTable />;
        } else if (selectedValue === "events") {
            return <InputEventsTable />;
        }
    };

    return (
        <section className="flex flex-col gap-4 w-full">
            <section className="flex flex-1 items-center justify-between">
                <Select onValueChange={handleValueChange} defaultValue={selectedValue}>
                    <SelectTrigger className="w-[180px] px-3 py-2 tracking-tight font-semibold">
                        <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className="w-[180px] p-2 bg-white z-10">
                            {table.map((item, index) => (
                                <SelectItem className="p-2" value={item.url} key={index}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>
            <section className="max-h-screen min-w-screen overflow-x-scroll overflow-y-scroll">
                <HandleTables />
            </section>
        </section>
    );
}
