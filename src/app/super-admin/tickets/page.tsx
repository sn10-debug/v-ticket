"use client";
import { useState, useEffect } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TicketCard } from "@vibrance/components/cards/TicketCard";
import Loading from "@vibrance/components/Loading";

export default function Page() {
    const [loading, setLoading] = useState<boolean>(true);

    let [tickets, setTickets] = useState<any>([]);
    let [openTickets, setOpenTickets] = useState([]);

    useEffect(() => {
        let fetchTickets = async () => {
            fetch("/api/tickets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setTickets(data);

                    let openTickets = data.filter((ticket: any) => {
                        if (ticket.categories === "Open") {
                            return ticket;
                        }
                    });
                    setOpenTickets(openTickets);
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        let fetchInterval = setInterval(() => {
            fetchTickets();
        }, 2000);
        setLoading(false);
        return () => clearInterval(fetchInterval);
    }, []);

    if (loading) return <Loading />;

    let ticketSets = [];
    for (let i = 0; i < openTickets.length; i += 3) {
        if (i + 3 > openTickets.length) {
            ticketSets.push(openTickets.slice(i, tickets.length));
            break;
        }
        ticketSets.push(openTickets.slice(i, i + 3));
    }

    return (
        <>
            {ticketSets.map((ticket, i) => (
                <div
                    className=""
                    style={{
                        width: "100vw",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {ticket.map((el, index) => (
                        <TicketCard ticket={el}></TicketCard>
                    ))}
                </div>
            ))}
        </>
    );
}
