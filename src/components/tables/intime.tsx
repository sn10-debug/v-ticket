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
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Loading from "@vibrance/components/Loading";

interface ITime {
    intime_id: string;
    intime_entry: string;
    username: string;
    reg_no: string;
    eventname: string;
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

export default function TimesTable() {
    const [times, setTimes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<ITime>();

    useEffect(() => {
        const fetchTimes = async () => {
            const response = await fetch("/api/database/InTime");
            const data = await response.json();
            setTimes(data.data);
            localStorage.setItem("data", JSON.stringify(data.data));
        };
        const fetchDataInterval = setInterval(() => {
            fetchTimes();
        }, 2000);

        setLoading(false);
        return () => clearInterval(fetchDataInterval);
    }, []);

    const handleSearch = () => {
        let newData = times.filter((item: any) => {
            return item.reg_no.toLowerCase() === searchQuery.toLowerCase();
        });
        setSearchResult(newData[0]);
    };

    function openDialog() {
        const dialog = document.getElementById("myDialog")!;
        // @ts-ignore
        dialog.showModal();
    }

    function closeDialog() {
        const dialog = document.getElementById("myDialog")!;
        // @ts-ignore
        dialog.close();
    }

    if (loading) return <Loading />;

    return (
        <>
            <dialog id="myDialog" className="w-3/4 p-4 rounded">
                {searchResult ? (
                    <Table className="rounded">
                        <TableHeader>
                            <TableRow className="border border-b-[1px]  text-md">
                                <TableCell className="text-center border-r-[2px]">
                                    Registration No
                                </TableCell>
                                <TableCell className="text-center border-r-[2px]">
                                    Registration No
                                </TableCell>
                                <TableCell className="border-r-[2px]">Name</TableCell>
                                <TableCell className="border-r-[2px]">
                                    Event Name
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    Intime
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-center border-r-[2px] border-l-[2px] ">
                                    {searchResult?.reg_no}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.username}
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    {searchResult?.eventname}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.intime_entry}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                ) : (
                    <section className="text-center">No data found</section>
                )}

                <Button className="my-4" onClick={closeDialog}>
                    Close
                </Button>
            </dialog>

            <section className="flex items-center rounded-lg mx-8 my-4">
                <IoIosSearch className="h-10 w-10 p-1 text-gray-500" />
                <Input
                    className="h-10"
                    placeholder="Search..."
                    type="search"
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                />
                <Button
                    className="m-2 bg-gray-900 text-white rounded-md px-4 py-2"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSearch();
                        openDialog();
                    }}
                >
                    Search
                </Button>
            </section>
            <Table className="text-left max-h-screen overflow-y-scroll">
                <TableHeader>
                    <TableRow className="border border-b-[1px] font-semibold text-md">
                        <TableCell className="text-center border-r-[2px]">
                            Registration No
                        </TableCell>
                        <TableCell className="border-r-[2px]">Name</TableCell>
                        <TableCell className="border-r-[2px]">Event Name</TableCell>
                        <TableCell className="border-r-[2px] text-center">
                            Intime
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <Skeleton className="h-4 w-full rounded bg-slate-[2px]00" />
                    ) : (
                        times.map((time: ITime, index) => (
                            <TableRow key={index} className="font-normal text-sm">
                                <TableCell className="text-center border-r-[2px] border-l-[2px] font-semibold">
                                    {time.reg_no}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {time.username}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {time.eventname}
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    {parseDate(new Date(time.intime_entry))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
