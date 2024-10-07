import { Attendance } from "@prisma/client";
import { processStudents } from "@vibrance/server/analytics";
import { db } from "@vibrance/server/db";
import { JwtPayload, verify } from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
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

        const attendance = await db.attendance.findMany({
            where: {
                eventsId: id,
            },
        });

        // Use Promise.all to handle the asynchronous calls
        const studentsPromises = attendance.map(async (element: Attendance) => {
            const user = await db.user.findUnique({
                where: {
                    id: element.userId,
                },
                select: {
                    name: true,
                    reg_no: true,
                    email: true,
                    gender: true,
                    broken: true,
                },
            });
            return user!;
        });

        const students = await Promise.all(studentsPromises);

        const result = processStudents([2, 5], [0, 2], students);

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
