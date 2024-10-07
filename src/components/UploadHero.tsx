"use client";
import { Events } from "@prisma/client";
import { useEffect, useState } from "react";
import Loading from "@vibrance/components/Loading";
import { FiUploadCloud } from "react-icons/fi";
import DataTable from "@vibrance/components/data/table";

export default function UploadHero() {
    const [events, setEvents] = useState<Events[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const columns = ["S. No", "Name", "Venue", "Date", "Bulk upload"];

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
        <>
            {" "}
            <section className="grid grid-cols-10 gap-4 py-2 px-4">
                <section className="col-start-2 col-span-8">
                    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                        Bulk Upload
                    </h2>
                    <h3 className="py-2 scroll-m-20 text-lg font-regular tracking-tight">
                        Select an event to do a bulk upload to ! All the analytics will be
                        based on this bulk upload so please do upload. Also please ensure
                        your data follows this{" "}
                        <a
                            href="/template.csv"
                            download
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            template
                        </a>
                        . Its okay if you have extra columns but the{" "}
                        <a className="font-bold">columns</a> in the template are{" "}
                        <a className="text-red-500 font-bold">mandatory</a>.
                    </h3>
                    <section className="border-t-2 border-zinc-400/75 pt-4 h-[0.75px]" />
                    <h5 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                        Events
                    </h5>
                    {loading ? (
                        <Loading />
                    ) : (
                        <DataTable
                            route="upload"
                            columns={columns}
                            data={events}
                            Icon={<FiUploadCloud className="text-3xl" />}
                        />
                    )}
                </section>
            </section>
        </>
    );
}
