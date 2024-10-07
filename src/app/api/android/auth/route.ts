import { db } from "@vibrance/server/db";
import convert from "@vibrance/server/pass";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (email === undefined || password === undefined) {
            return new Response(
                JSON.stringify({
                    error: {
                        message: "Invalid request",
                    },
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const user = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return new Response(
                JSON.stringify({
                    error: {
                        message: "User not found",
                    },
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (user.password === convert(password)) {
            if (user.role === "Student") {
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
            const token = sign({ userId: user.id }, process.env.NEXTAUTH_SECRET!, {
                expiresIn: "768h",
            });

            return new Response(
                JSON.stringify({
                    data: {
                        token: token,
                        user: user.name,
                        id: user.id,
                        reg_no: user.reg_no,
                    },
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
                        message: "Invalid password",
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
    } catch (error) {
        console.error("Error:", error);

        return new Response(
            JSON.stringify({
                error: {
                    message: "Internal Server Error",
                },
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
