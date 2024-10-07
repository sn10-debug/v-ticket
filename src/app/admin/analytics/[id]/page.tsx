"use client";
import Loading from "@vibrance/components/Loading";
import CustomLineChart from "@vibrance/components/charts/line";
import {
    GenericCard,
    OverallStudents,
    YearwiseCard,
} from "@vibrance/components/cards/Card";
import type { BranchData } from "@vibrance/types/analytics";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Label } from "recharts";

type Result = {
    name: string;
    total: number;
    gender: {
        Boys: number;
        Girls: number;
    };
    yearly: BranchData;
    branch: BranchData;
};

type Timeseries = {
    time: string;
    students: number;
};

export default function Handler() {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState<Result>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`/api/analytics/${id}`);
                const data = await res.json();
                setAnalytics(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
            setLoading(false);
        };
        setTimeout(() => fetchAnalytics(), 2500);
    }, [id]);

    if (loading) {
        return <Loading />;
    }
    if (loading === false) {
        return (
            <section className="grid grid-cols-10 gap-4">
                <section className="col-start-2 col-span-8 py-2">
                    <h1 className="text-4xl font-extrabold tracking-tight py-2">
                        Analytics of {analytics?.name}
                    </h1>
                    <section className="grid grid-cols-4 gap-4 py-2">
                        <section className="col-span-1">
                            <OverallStudents total_students={analytics?.total!} />
                        </section>
                        <section className="col-span-1">
                            <GenericCard
                                GenericData={analytics?.yearly!}
                                message="View the total number of students grouped by year"
                                title="Year"
                            />
                        </section>
                        <section className="col-span-1">
                            <GenericCard
                                GenericData={analytics?.gender!}
                                message="View the total number of students grouped by gender"
                                title="Gender"
                            />
                        </section>
                        <section className="col-span-1">
                            <GenericCard
                                GenericData={analytics?.branch!}
                                message="View the total number of students grouped by branch"
                                title="Branch"
                            />
                        </section>
                    </section>
                    <section className="w-full grid grid-cols-1">
                        <CustomLineChart id={id as string} />
                    </section>
                </section>
            </section>
        );
    }
}
