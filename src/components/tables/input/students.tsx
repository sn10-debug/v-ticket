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
    id: string;
    paidStatus: boolean;
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
    const [result, setResult] = useState<boolean>();
    const [selectOptions, setSelectOptions] = useState<SelectType>({} as SelectType);

    const handleYearChange = (value: string) => {
        setSelectOptions({ ...selectOptions, year: value });
    };

    const handleBrokenStatus = (value: string) => {
        setSelectOptions({ ...selectOptions, broken: value });
    };

    const handleChange = (key: string, value: string) => {
        if (!searchResult) return;

        if (searchResult != undefined) {
            if (key === "reg_no") {
                searchResult.reg_no = value;
            } else if (key === "name") {
                searchResult.name = value;
            } else if (key === "email") {
                searchResult.email = value;
            } else if (key === "phone") {
                searchResult.phone = value;
            } else if (key === "serial_id") {
                searchResult.serial_id = value;
            } else if (key === "paidStatus") {
                if (value.toLowerCase() == "yes") {
                    searchResult.paidStatus = true;
                } else {
                    searchResult.paidStatus = false;
                }
            } else if (key === "broken") {
                if (value.toLowerCase() == "yes") {
                    searchResult.broken = true;
                } else {
                    searchResult.broken = false;
                }
            } else if (key === "year") {
                searchResult.year = value;
            } else if (key === "branch") {
                searchResult.branch = value;
            }
        }
        setSearchResult(searchResult);
    };

    const fetchStudents = async () => {
        const response = await fetch("/api/database/user");
        const data = await response.json();
        setStudents(data.data);
    };

    const handleUpload = async () => {
        const res = await fetch("/api/super-admin/edit/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reg_no: searchResult?.reg_no,
                name: searchResult?.name,
                email: searchResult?.email,
                phone: searchResult?.phone,
                serial_id: searchResult?.serial_id,
                paidStatus: searchResult?.paidStatus,
                broken: searchResult?.broken,
                year: searchResult?.year,
                branch: searchResult?.branch,
                id: searchResult?.id,
            }),
        });
        const json = await res.json();
        if (json.message == "Student data updated successfully") {
            setResult(true);
        }
        fetchStudents();
    };

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch("/api/database/user");
            const data = await response.json();
            setStudents(data.data);
        };

        fetchStudents();
        setLoading(false);
    }, []);

    if (loading) return <Loading />;

    const handleSearch = () => {
        setResult(false);
        let newData = students.filter((item: StudentTable) => {
            return (
                item?.reg_no?.toLowerCase() === searchQuery.toLowerCase() ||
                item?.name?.toLowerCase() === searchQuery.toLowerCase() ||
                item?.email?.toLowerCase() === searchQuery.toLowerCase()
            );
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
                                <TableCell className="border-r-[2px]">
                                    Payment Status
                                </TableCell>
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
                                    <Input
                                        placeholder={searchResult?.reg_no}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("reg_no", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={searchResult?.name}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("name", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={searchResult?.email}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("email", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    <Input
                                        placeholder={searchResult?.phone}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("phone", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={searchResult?.serial_id}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("serial_id", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={
                                            searchResult?.paidStatus ? "Yes" : "No"
                                        }
                                        type="text"
                                        onChange={(e) => {
                                            if (e.target.value.toLowerCase() == "yes") {
                                                handleChange("paidStatus", "true");
                                            } else {
                                                handleChange("paidStatus", "false");
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px] text-center">
                                    {searchResult?.broken ? "Yes" : "No"}
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={searchResult?.year}
                                        type="text"
                                        onChange={(e) => {
                                            handleChange("year", e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="border-r-[2px]">
                                    <Input
                                        placeholder={searchResult?.branch}
                                        onChange={(e) => {
                                            handleChange("branch", e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                ) : (
                    <section className="text-center">No data found</section>
                )}
                <section className="flex flex-1 w-full justify-between">
                    <Button className="my-4" onClick={closeDialog}>
                        Close
                    </Button>
                    <Button className="my-4" onClick={handleUpload}>
                        Update
                    </Button>
                </section>
                <section className="text-green-500">
                    {result ? "Data updated successfully" : ""}
                </section>
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
                        <TableCell className="border-r-[2px]">
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
                        </TableCell>
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
                                <TableCell className="border-r-[2px]">
                                    {student.paidStatus ? "Yes" : "No"}
                                </TableCell>
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
