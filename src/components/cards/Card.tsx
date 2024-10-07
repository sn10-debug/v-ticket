"use client";
import { Events } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadui/card";
import Loading from "@vibrance/components/Loading";
import DataTable from "@vibrance/components/data/table";
import { ChangeEvent, useEffect, useState } from "react";
import { SiGoogleanalytics } from "react-icons/si";

interface Analytics {
    users_count: number;
    yearly_data: {
        [key: string]: number;
    };
    branch_wise_data: {
        [key: string]: number;
    };
}

interface YearlyData {
    [key: string]: number;
}

interface GenericProps {
    [key: string]: number;
}

interface BranchWiseData {
    [key: string]: number;
}

const EventsComponent = (props: {
    columns: string[];
    events: Events[];
    loading: boolean;
}) => {
    const { columns, events, loading } = props;
    return (
        <>
            <h5 className="py-2 scroll-m-20 text-3xl font-semibold tracking-tight">
                Events
            </h5>
            {loading ? (
                <Loading />
            ) : (
                <DataTable
                    route="analytics"
                    columns={columns}
                    data={events}
                    Icon={<SiGoogleanalytics className="text-3xl" />}
                />
            )}
        </>
    );
};

export const OverallStudents = (props: { total_students: number }): JSX.Element => {
    const { total_students } = props;
    return (
        <Card className="w-[300px] h-[240px] rounded-lg p-4">
            <CardHeader>
                <CardTitle className="text-xl font-medium">
                    Total registered students
                </CardTitle>
                <CardDescription>
                    View the total number of students registered.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-6xl text-center font-semibold pt-8">
                {total_students}
            </CardContent>
        </Card>
    );
};

export const YearwiseCard = (props: { yearly_data: YearlyData }): JSX.Element => {
    const { yearly_data } = props;

    const first = Object.keys(yearly_data)[0]!;
    const keys: string[] = Object.keys(yearly_data);

    const [selectedYear, setSelectedYear] = useState<string>(first);

    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    return (
        <Card className="w-[300px] h-[210px] p-4 rounded-lg">
            <CardHeader>
                <CardTitle className="flex justify-between w-full items-center">
                    <section className="font-medium text-xl">Yearwise</section>
                    <section className="font-regular">
                        <select
                            className="border-[0.75px] rounded-sm border-black text-base"
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {keys.map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </section>
                </CardTitle>
                <CardDescription>
                    View the total number of students grouped by year.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-6xl text-center py-8 font-semibold">
                {yearly_data[selectedYear]}
            </CardContent>
        </Card>
    );
};

export const BranchWiseCard = (props: { branch_wise: BranchWiseData }): JSX.Element => {
    const { branch_wise } = props;
    const first = Object.keys(branch_wise)[0]!;

    const [selectedBranch, setSelectedBranch] = useState<string>(first); // Set the initial state as a string

    const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranch(event.target.value);
    };

    const keys: string[] = Object.keys(branch_wise);
    return (
        <Card className="w-[300px] h-[210px] p-4 rounded-lg">
            <CardHeader>
                <CardTitle className="flex justify-between w-full items-center">
                    <section className="font-medium text-xl">Branchwise</section>
                    <section className="font-regular">
                        <select
                            className="border-[0.75px] rounded-sm border-black text-base"
                            value={selectedBranch}
                            onChange={handleBranchChange}
                        >
                            {keys.map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </section>
                </CardTitle>
                <CardDescription>
                    View the total number of students grouped by branch.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-6xl text-center py-8 font-semibold">
                {branch_wise[selectedBranch]}
            </CardContent>
        </Card>
    );
};

export const GenericCard = (props: {
    GenericData: GenericProps;
    message: string;
    title: string;
}): JSX.Element => {
    const { GenericData, message, title } = props;

    const first = Object.keys(GenericData)[0]!;
    const keys: string[] = Object.keys(GenericData);

    const [selectedYear, setSelectedYear] = useState<string>(first);

    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    return (
        <Card className="w-[300px] h-[240px] rounded-lg p-4">
            <CardHeader>
                <CardTitle className="flex justify-between w-full items-center">
                    <section className="font-medium text-xl">{title}</section>
                    <section className="font-regular">
                        <select
                            className="border-[0.75px] rounded-sm border-black text-base"
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {keys.map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </section>
                </CardTitle>
                <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="text-6xl text-center font-semibold pt-8">
                {GenericData[selectedYear]}
            </CardContent>
        </Card>
    );
};
