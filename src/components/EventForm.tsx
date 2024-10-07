"use client";
import { Button } from "@shadui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface RegisterEventProps {
    eventName: string;
    eventDescription: string;
    eventVenue: string;
    eventDate: string;
    user: any;

}

interface ResponseType {
    eventId: string;
    status: string;
}

export default function RegisterEvent(): JSX.Element {
    const session = useSession();
    const [eventDetails, setEventDetails] = useState<RegisterEventProps>({
        eventName: "",
        eventDescription: "",
        eventVenue: "",
        eventDate: "",
        user: session?.data?.user,
    });

    const [checked, setChecked] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();
    const Handle = async () => {
        if (
            eventDetails.eventName == "" ||
            eventDetails.eventDescription == "" ||
            eventDetails.eventVenue == "" ||
            eventDetails.eventDate == ""
        ) {
            setError(true);
            return;
        }

        let res = await fetch("/api/events", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(eventDetails),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let resp: ResponseType = await res.json();
        let eventId = resp.eventId;

        if (checked) {
            router.push(`/super-admin/upload/${eventId}/`);
        } else {
            router.push("/super-admin");
        }
    };

    return (
        <section className="grid grid-cols-10 gap-4 py-2 px-4">
            <section className="col-start-2 col-span-8">
                <section className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                    Create an Event
                </section>
                <h3 className="py-2 scroll-m-20 text-lg font-regular tracking-tight">
                    To achieve this, you would typically follow a multi-step process
                    involving creating tables for events and NFC tags, registering an
                    event to the database, and associating NFC tags with the event
                </h3>
                <section className="border-t-2 border-zinc-400/75 py-4 h-[0.75px]" />
                <form className="bg-slate-100/75 p-2 h-fit rounded-md flex flex-col gap-3">
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Event name*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="text"
                        placeholder="Vibrance day - 1"
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                eventName: e.target.value,
                            })
                        }
                    />
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Event Description*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="text"
                        placeholder="Lorem Ipsum Dolor ...."
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                eventDescription: e.target.value,
                            })
                        }
                    />
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Venue*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="text"
                        placeholder="Academic Block - 1"
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                eventVenue: e.target.value,
                            })
                        }
                    />
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Date*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="date"
                        placeholder="Vibrance day - 1"
                        onChange={(e) =>
                            setEventDetails({
                                ...eventDetails,
                                eventDate: e.target.value,
                            })
                        }
                    />
                    {error ? (
                        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-red-500">
                            Please fill all the fields
                        </h4>
                    ) : (
                        <></>
                    )}
                    <section className="flex flex-1 w-full justify-end gap-2 py-2">
                        <input
                            type="checkbox"
                            id="upload"
                            onClick={() => setChecked(!checked)}
                        />
                        <label
                            htmlFor="upload"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Continue to bulk upload
                        </label>
                    </section>
                    <section className="flex flex-1 w-full justify-end items-center py-2">
                        <Button
                            className="bg-zinc-900 text-white py-2 px-4 rounded-md font-regular text-md"
                            onClick={(e) => {
                                e.preventDefault();
                                Handle();
                            }}
                        >
                            Submit
                        </Button>
                    </section>
                </form>
            </section>
        </section>
    );
}
