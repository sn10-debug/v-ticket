import { verify, JwtPayload } from "jsonwebtoken";
import { db } from "@vibrance/server/db";
import { Events } from "@prisma/client";

type ProshowEvent = {
    gold: Events[],
    platinum: Events[],
    silver: Events[]
}

export async function POST(req: Request) {
    const { token } = await req.json();
    const decodedToken: JwtPayload | string = verify(token, process.env.NEXTAUTH_SECRET!);

    // @ts-ignore
    const userId = decodedToken?.userId;

    if (userId) {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                role: true,
            },
        });

        if (user?.role === "Student") {
            return new Response(
                JSON.stringify({
                    error: {
                        message: "User not allowed",
                    },
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const events_ = await db.events.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                date: true,
                venue: true,
            },
        });


        let events=events_.filter((event:any)=>!(event?.name?.includes("Proshow-")))
        



        return new Response(
            JSON.stringify({
                status: 200,
                message: "success",
                data: events,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } else {
        return new Response(
            JSON.stringify({
                error: {
                    message: "User not allowed",
                },
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
