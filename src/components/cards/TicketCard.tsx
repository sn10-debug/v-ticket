"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import "../../styles/ticketCardStyle.css";

export const TicketCard = (props: any): JSX.Element => {
    let session = useSession();
    let [ticket, setTicket] = useState(props.ticket);
    let [refferedString, setRefferedString] = useState("");
    let [refferedStatus, setRefferedStatus] = useState(false);

    async function closeTicket(e: any) {
        let body = {
            ticket: ticket,
            user: session.data?.user ? session.data.user : null,
        };

        let response = await fetch("/api/tickets/close", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        response.json().then((data) => {
            setTicket(data.ticket);
        });
    }

    async function referTicket() {
        let body = {
            ticket: { ...ticket, referredString: "Need to be Referred" },
            // @ts-ignore
            user: session.data.user,
        };

        if (refferedStatus) {
            let response = await fetch("/api/tickets/refer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            response.json().then((data) => {
                setTicket(data.ticket);
            });
        }

        setRefferedStatus(!refferedStatus);
    }

    return (
        <div>
            {!(ticket.categories == "Close" || ticket.categories == "referred") ? (
                <div className="cards__item">
                    <div className="card">
                        <div className="card__content">
                            <div className="card__title">
                                {props.ticket.title ? props.ticket.title : "Ticket Title"}
                            </div>
                            <p className="card__text">
                                {props.ticket.description
                                    ? props.ticket.description
                                    : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "}
                            </p>
                            <p className="card__text">
                                Events ID :{" "}
                                {props.ticket.eventsId
                                    ? props.ticket.eventsId
                                    : "1234XXXX"}
                            </p>

                            <p className="card__text">
                                Created By :{" "}
                                {props.ticket.createdById
                                    ? props.ticket.createdById
                                    : "Shakti Nayak"}
                            </p>
                            <p className="card__text">
                                Registration Number :{" "}
                                {props.ticket.reg_no ? props.ticket.reg_no : "21BRS1490"}
                            </p>
                            {refferedStatus ? (
                                <input
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        margin: "10px 0",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                    }}
                                    type="text"
                                    placeholder="Refer Message"
                                    name="referMessage"
                                    id="referMessage"
                                    className="form__input"
                                    value={refferedString}
                                    onChange={(e) => {
                                        setRefferedString(e.target.value);
                                    }}
                                ></input>
                            ) : (
                                ""
                            )}
                            <button
                                onClick={referTicket}
                                className="btn btn--block card__btn"
                            >
                                {refferedStatus ? "Submit" : "Refer Ticket"}
                            </button>
                            <button
                                onClick={closeTicket}
                                className="btn btn--block card__btn"
                            >
                                Close Ticket
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
