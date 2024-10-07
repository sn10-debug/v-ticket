import { db } from "@vibrance/server/db";

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

    if (!ticket.id) {
        return new Response(JSON.stringify({ message: "Ticket id is required" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    if (!ticket.referredString) {
        return new Response(JSON.stringify({ message: "Referred String is required" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    if (!(user.role == "Admin" || user.role == "SuperAdmin")) {
        return new Response(
            JSON.stringify({ message: "You are not allowed to close ticket" }),
            {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            },
        );
    }

    try {
        await db.tickets.update({
            where: {
                id: ticket.id,
                categories: "Open",
            },
            data: {
                categories: "referred",
                referredString: ticket.referredString,
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: "Ticket not found" }), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }

    await db.log.create({
        data: {
            userId: user.id,
            action: "Open",
            message: "Ticket Refered " + ticket.id,
        },
    });

    ticket = await db.tickets.findFirst({
        where: {
            id: ticket.id,
        },
    });

    return new Response(
        JSON.stringify({ message: "Ticket Refered successfully", ticket }),
        {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        },
    );
}
