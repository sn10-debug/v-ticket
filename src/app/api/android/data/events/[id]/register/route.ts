import { db } from "@vibrance/server/db";
import { JwtPayload, verify } from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const {
            token,
            serialNo,
            verifyingUser,
            studentID,
            user: createdBy,
        } = await req.json();
        const decodedToken: JwtPayload | string = verify(
            token,
            process.env.NEXTAUTH_SECRET!,
        );

        // @ts-ignore
        const userId = decodedToken?.userId;

        if (userId) {
            const user = await db.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                return new Response(
                    JSON.stringify({
                        error: "Admin not found",
                    }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            const student = await db.user.findUnique({
                where: {
                    reg_no: studentID,
                },
            });

            if (!student) {
                return new Response(
                    JSON.stringify({
                        error: {
                            message: "Student not found",
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

            if (user?.role === "Student") {
                return new Response(
                    JSON.stringify({
                        error: {
                            message: "Student not allowed",
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

            try {
                let user = await db.user.findUnique({
                    where: {
                        reg_no: studentID,
                    },
                });

                if (user?.serial_id) {
                    await db.log.create({
                        data: {
                            userId: createdBy.id,
                            action: "Update",
                            message: "Tapped for User already registered " + studentID,
                        },
                    });

                    return new Response(
                        JSON.stringify({
                            error: {
                                message: "User already registered",
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

                await db.user.update({
                    where: {
                        reg_no: studentID,
                    },
                    data: {
                        serial_id: serialNo,
                    },
                });

                await db.log.create({
                    data: {
                        userId: createdBy.id,
                        action: "Update",
                        message: "Tapped for User " + studentID,
                    },
                });
            } catch (e) {
                return new Response(
                    JSON.stringify({
                        error: {
                            message: "Serial Number already exists",
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

            return new Response(
                JSON.stringify({
                    status: 200,
                    message: "Succesfully Registered !!",
                    data: user,
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
    } catch (error) {
        console.error("Error in POST function:", error);
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
