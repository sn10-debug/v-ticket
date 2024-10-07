import { db } from "@vibrance/server/db";
import { computeBranchData, computeYearlyData } from "@vibrance/server/analytics";
import type { Result } from "@vibrance/types/analytics";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const result: Result = {
        name: "",
        total: 0,
        gender: {
            Boys: 0,
            Girls: 0,
        },
        yearly: {},
        branch: {},
    };

    // Batched query to fetch event information and attendance data
    const [event, attendance] = await Promise.all([
        db.events.findUnique({
            where: {
                id: id,
            },
            select: {
                name: true,
            },
        }),
        db.attendance.findMany({
            where: {
                eventsId: id,
            },
        }),
    ]);

    result["name"] = event!.name!;
    result["total"] = attendance.length;

    // Batched query to fetch user information
    const users = await db.user.findMany({
        where: {
            id: { in: attendance.map((item: any) => item.userId) },
        },
        select: {
            id: true,
            gender: true,
            reg_no: true,
        },
    });

    // Process user data in parallel
    await Promise.all(
        users.map((user: any) => {
            if (user.gender?.toLowerCase() === "male") {
                result["gender"]["Boys"] += 1;
            } else if (user.gender?.toLowerCase() === "female") {
                result["gender"]["Girls"] += 1;
            }

            computeBranchData(result["branch"], 2, 5, user);
            computeYearlyData(result["yearly"], 0, 2, user);
        }),
    );

    return new Response(JSON.stringify(result));
}
