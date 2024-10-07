import { db } from "@vibrance/server/db";
import { verify, JwtPayload } from "jsonwebtoken";

export async function POST(req: Request) {
    const { studentID, verifyingUser, eventID, token } = await req.json();

    if (token === "") {
        return new Response(
            JSON.stringify({
                status: 401,
                body: {
                    message: "Missing token",
                },
            }),
        );
    }

    const decodedToken: JwtPayload | string = verify(token, process.env.NEXTAUTH_SECRET!);

    // @ts-ignore
    const userId = decodedToken?.userId;

    if (userId === "") {
        return new Response(
            JSON.stringify({
                status: 401,
                body: {
                    message: "Invalid token",
                },
            }),
        );
    }

    let checkUser = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!checkUser) {
        return new Response(
            JSON.stringify({
                status: 401,
                body: {
                    message: "Staff user not found",
                },
            }),
        );
    }

    if (studentID === "" || verifyingUser === "") {
        return new Response(
            JSON.stringify({
                status: 400,
                body: {
                    message: "Missing required data",
                },
            }),
        );
    }

    let user = await db.user.findUnique({
        where: {
            reg_no: studentID,
        },
    });

    if (!user) {
        return new Response(
            JSON.stringify({
                status: 403,
                body: {
                    message: "User not found",
                },
            }),
        );
    }

    let attendance = await db.attendance.findFirst({
        where: {
            userId: user.id,
            eventsId: eventID,
        },
    });

    if (!attendance) {
        return new Response(
            JSON.stringify({
                status: 403,
                body: {
                    message: `${user.name} is not registered for this event`,
                },
            }),
        );
    }

    if (attendance && user) {
        await db.user.update({
            where: {
                reg_no: studentID,
            },
            data: {
                broken: true,
            },
        });

        return new Response(
            JSON.stringify({
                status: 200,
                message: "User marked as broken",
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
                status: 400,
                message: "Faulty request",
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
