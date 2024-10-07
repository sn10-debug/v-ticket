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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StudentTable {
    reg_no: string;
    name: string;
    email: string;
    phone: string;
    serial_id: string;
    broken: boolean;
    year: string;
    branch: string;
}

interface SelectType {
    year: string;
    paidStatus: string;
    broken: string;
}

export default function StudentsTable() {
    const [students, setStudents] = useState<StudentTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<StudentTable>();
    const [selectOptions, setSelectOptions] = useState<SelectType>({} as SelectType);

    const handleYearChange = (value: string) => {
        setSelectOptions({ ...selectOptions, year: value });
    };

    const handleBrokenStatus = (value: string) => {
        setSelectOptions({ ...selectOptions, broken: value });
    };

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch("/api/database/user");
            const data = await response.json();
            setStudents(data.data);
            localStorage.setItem("studentsData", JSON.stringify(data.data));
        };

        fetchStudents();

        const fetchStudentsInterval = setInterval(() => {
            fetchStudents();
        }, 2000);

        setLoading(false);
        return () => clearInterval(fetchStudentsInterval);
    }, []);

    if (loading) return <Loading />;

    const handleSearch = () => {
        let newData = students.filter((item: StudentTable) => {
            return item?.reg_no?.toLowerCase() === searchQuery.toLowerCase();
        });
        setSearchResult(newData[0]);
    };

    const handlePaidChange = (value: string) => {
        setSelectOptions({ ...selectOptions, paidStatus: value });
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

    return (
        <>
            <dialog id="myDialog" className="w-4/5 p-4 rounded">
                {searchResult ? (
                    <Table className="rounded">
                        <TableHeader>
                            <TableRow className="border border-b-[1px]  text-md">
                                <TableCell className="text-center border-r-[2px]">
                                    Registration No
                                </TableCell>

                                <TableCell className="border-r-[2px]">Name</TableCell>
                                <TableCell className="flex flex-[2px] items-center justify-between border-r-[2px]">
                                    <section className="">Email</section>
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    Phone number
                                </TableCell>
                                <TableCell className="border-r-[2px]">Hex ID</TableCell>
                              
                                <TableCell className="border-r-[2px] text-center">
                                    Broken
                                </TableCell>
                                <TableCell className="border-r-[2px]">Year</TableCell>
                                <TableCell className="border-r-[2px]">Branch</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="font-normal">
                                <TableCell className="text-center border-r-[2px] border-l-[2px] ">
                                    {searchResult?.reg_no}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.name}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.email}
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    {searchResult?.phone}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.serial_id}
                                </TableCell>
                                
                                <TableCell className="border-r-[2px] text-center">
                                    {searchResult?.broken ? "Yes" : "No"}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.year}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {searchResult?.branch}
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
            <Table className="text-left h-screen overflow-y-scroll">
                <TableHeader>
                    <TableRow className="border border-b-[1px] font-semibold text-md">
                        <TableCell className="text-center border-r-[2px]">
                            Registration No
                        </TableCell>
                        <TableCell className="border-r-[2px]">Name</TableCell>
                        <TableCell className="border-r-[2px]">Email</TableCell>
                        <TableCell className="border-r-[2px] text-center">
                            Phone number
                        </TableCell>
                        <TableCell className="border-r-[2px]">Hex ID</TableCell>
                        {/* <TableCell className="border-r-[2px]">
                            <Select onValueChange={handlePaidChange}>
                                <SelectTrigger className="px-3 py-2 tracking-tight font-semibold">
                                    <SelectValue placeholder="Payment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="w-24 p-2 bg-white z-10 text-lg">
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell> */}
                        <TableCell className="border-r-[2px] text-center">
                            <Select onValueChange={handleBrokenStatus}>
                                <SelectTrigger className="px-3 py-2 tracking-tight font-semibold">
                                    <SelectValue placeholder="Broken" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="w-24 p-2 bg-white z-10 text-lg">
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="border-r-[2px]">
                            <Select onValueChange={handleYearChange}>
                                <SelectTrigger className="px-3 py-2 tracking-tight font-semibold">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="w-24 p-2 bg-white z-10 text-lg">
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="border-r-[2px]">
                            <Select>
                                <SelectTrigger className="px-3 py-2 tracking-tight font-semibold">
                                    <SelectValue placeholder="Branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="w-24 p-2 bg-white z-10 text-lg"></SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <Skeleton className="h-4 w-full rounded bg-slate-[2px]00" />
                    ) : (
                        students.map((student) => (
                            <TableRow
                                key={student.reg_no}
                                className="font-normal text-sm"
                            >
                                <TableCell className="text-center border-r-[2px] border-l-[2px] font-semibold">
                                    {student.reg_no}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {student.name}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {student.email}
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    {student.phone}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {student.serial_id}
                                </TableCell>
                                {/* <TableCell className="border-r-[2px]">
                                    {student.paidStatus ? "Yes" : "No"}
                                </TableCell> */}
                                <TableCell className="border-r-[2px] text-center">
                                    {student.broken ? "Yes" : "No"}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {student.year}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    {student.branch}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
