import { db } from "@vibrance/server/db";

export async function GET(req: Request) {
    const tickets = await db.tickets.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            type: true,
            reg_no: true,
            eventsId: true,
            created_at: true,
            createdById: true,
            categories: true,
        },
    });
    return new Response(JSON.stringify(tickets));
}

export async function POST(req: Request) {
    let { ticket, user } = await req.json();

    user = await db.user.findFirst({
        where: {
            id: user.id,
        },
    });

    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    if (
        !ticket.title ||
        !ticket.description ||
        !ticket.type ||
        !ticket.reg_no ||
        !ticket.eventsId ||
        !ticket.categories
    ) {
        return new Response(JSON.stringify({ message: "All fields are required" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    if (ticket.type == "custom" && !ticket.description) {
        return new Response(JSON.stringify({ message: "Description is required" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    let ticketTypes = ["Broken_ID", "Payment_Issue", "User_Not_Found", "Custom"];

    if (!ticketTypes.includes(ticket.type)) {
        ticket.type = "Custom";
    }
    if (!(user.role == "Admin" || user.role == "Staff")) {
        return new Response(
            JSON.stringify({ message: "You are not allowed to create ticket" }),
            {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            },
        );
    }

    await db.tickets.create({
        data: {
            title: ticket.title,
            description: ticket.description ? ticket.description : "",
            type: ticket.type,
            reg_no: ticket.reg_no,
            eventsId: ticket.eventsId,

            categories: ticket.category,

            createdById: user.id,
        },
    });

    await db.log.create({
        data: {
            userId: user.id,
            action: "Create",
            message: "Ticket Created",
        },
    });

    return new Response(JSON.stringify({ message: "Ticket Created" }), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}
