import { db } from "@vibrance/server/db";
import { verify } from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        const decodedToken = verify(token, process.env.NEXTAUTH_SECRET!) as {
            userId: string;
        };

        const user = await db.user.findUnique({
            where: {
                id: decodedToken.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (user) {
            return new Response(
                JSON.stringify({
                    status: 200,
                    message: "success",
                    user: user,
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
                    status: 404,
                    message: "User not found",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }
    } catch (error) {
        console.error("Error:", error);

        return new Response(
            JSON.stringify({
                status: 401,
                message: "Invalid or expired token",
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
