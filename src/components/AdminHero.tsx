"use client";
import { SiGoogleanalytics } from "react-icons/si";
import { Events } from "@prisma/client";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import DataTable from "@vibrance/components/data/table";

const columns = ["S. No", "Name", "Venue", "Date", "View Analytics"];

export default function AdminHero() {
    const [events, setEvents] = useState<Events[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchEvents() {
            const res = await fetch("/api/events");
            const events = await res.json();
            setEvents(events);
        }
        fetchEvents();
        setLoading(false);
    }, []);

    return (
        <section className="grid grid-cols-10 min-h-screen w-full gap-6 py-4">
            <section className="col-start-2 col-span-8">
                <section className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Vibrance Admin
                </section>
                <section className="text-zinc-500 font-semibold text-lg tracking-tight pb-2 pt-4 leading-10">
                    This is an admin platform to access and track the prototype app. View
                    insights into the application and track data here.
                </section>
                <section className="scroll-m-20 pb-2 text-2xl font-regular tracking-tight first:mt-0 py-2 ">
                    Events of 24
                </section>
                {loading ? (
                    <Loading />
                ) : (
                    <DataTable
                        columns={columns}
                        data={events}
                        route="analytics"
                        Icon={<SiGoogleanalytics className="text-lg" />}
                    />
                )}
            </section>
        </section>
    );
}
