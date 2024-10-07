import { processStudents } from "@vibrance/server/analytics";
import { db } from "@vibrance/server/db";
import { JwtPayload, verify } from "jsonwebtoken";

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

        const students_ = await db.user.findMany({
            where: {
                role: "Student",
            },
            select: {
                name: true,
                reg_no: true,
                email: true,
                gender: true,
                broken: true,
            },
        });
        let result = processStudents([2, 5], [0, 2], students_);
        return new Response(
            JSON.stringify({
                status: 200,
                message: "success",
                data: result,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } else {
        return new Response("Invalid token with no user id", {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
