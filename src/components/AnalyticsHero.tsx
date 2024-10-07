"use client";
import { Events } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadui/card";
import Loading from "@vibrance/components/Loading";
import DataTable from "@vibrance/components/data/table";
import { useSession } from "next-auth/react";
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
        <section className="py-4 px-2 rounded-md ">
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
        </section>
    );
};

const OverallStudents = (props: { total_students: number }): JSX.Element => {
    const { total_students } = props;
    return (
        <Card className="w-[370px] h-[210px] rounded-lg p-4">
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

const YearwiseCard = (props: { yearly_data: YearlyData }): JSX.Element => {
    const { yearly_data } = props;

    const first = Object.keys(yearly_data)[0]!;
    const keys: string[] = Object.keys(yearly_data);

    const [selectedYear, setSelectedYear] = useState<string>(first);

    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    return (
        <Card className="w-[370px] h-[210px] rounded-lg p-4">
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
            <CardContent className="text-6xl text-center font-semibold pt-8">
                {yearly_data[selectedYear]}
            </CardContent>
        </Card>
    );
};

const BranchWiseCard = (props: { branch_wise: BranchWiseData }): JSX.Element => {
    const { branch_wise } = props;
    const first = Object.keys(branch_wise)[0]!;

    const [selectedBranch, setSelectedBranch] = useState<string>(first); // Set the initial state as a string

    const handleBranchChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranch(event.target.value);
    };

    const keys: string[] = Object.keys(branch_wise);
    return (
        <Card className="w-[370px] h-[210px] rounded-lg p-4">
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
            <CardContent className="text-6xl text-center font-semibold pt-8">
                {branch_wise[selectedBranch]}
            </CardContent>
        </Card>
    );
};

export default function AnalyticsHero() {
    const [events, setEvents] = useState<Events[]>([]);
    const [data, setData] = useState<Analytics>({} as Analytics);
    const [loading, setLoading] = useState<boolean>(true);
    const columns = ["S. No", "Name", "Venue", "Date", "Analytics"];

    useEffect(() => {
        async function fetchEvents() {
            try {
                let res = await fetch("/api/events");
                const events = await res.json();
                res = await fetch("/api/analytics");
                const analytics = await res.json();
                setEvents(events);
                setData(analytics);
                setLoading(false); // Set loading to false after both fetches are complete
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        }

        fetchEvents();
    }, []);

    if (loading == true) {
        return <Loading />;
    }

    if (loading === false) {
        return (
            <>
                {" "}
                <section className="grid grid-cols-10 gap-4 py-2 px-4">
                    <section className="col-start-2 col-span-8">
                        <h2 className="scroll-m-20 text-4xl font-bold tracking-tighter">
                            View Analytics
                        </h2>
                        <h3 className="py-2 scroll-m-20 text-lg font-regular tracking-tight">
                            View analytics of the events
                        </h3>
                        <section className="border-t-2 border-zinc-390/75 pt-4 h-[0.75px]" />
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight pt-2 pb-4">
                            Consolidated details
                        </h2>
                        <section className="grid grid-cols-3 gap-4 w-full">
                            <section className="col-span-1 col-start-1">
                                <OverallStudents total_students={data.users_count} />
                            </section>
                            <section className="col-span-1 col-start-2">
                                <YearwiseCard yearly_data={data.yearly_data} />
                            </section>
                            <section className="col-span-1 col-start-3">
                                <BranchWiseCard branch_wise={data.branch_wise_data} />
                            </section>
                        </section>
                        <EventsComponent
                            columns={columns}
                            events={events}
                            loading={loading}
                        />
                    </section>
                </section>
            </>
        );
    }
}
