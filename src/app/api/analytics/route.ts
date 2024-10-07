import type { User } from "@prisma/client";
import { db } from "@vibrance/server/db";
import { process_users } from "@vibrance/server/users";
import { BranchData } from "@vibrance/types/analytics";
import { csvParseRows } from "d3";

interface UserDataResponse {
    users_count: number;
    yearly_data: BranchData;
    branch_wise_data: BranchData;
}

export async function GET(request: Request): Promise<Response> {
    try {
        const users: User[] = await db.user.findMany({
            where: {
                role: "Student",
            },
        });

        const years = await db.user.groupBy({
            by: ["year"],
            where: {
                year: {
                    not: null,
                },
            },
        });

        const branches = await db.user.groupBy({
            by: ["branch"],
            where: {
                branch: {
                    not: null,
                },
            },
        });

        let result: UserDataResponse = {
            users_count: 0,
            yearly_data: {},
            branch_wise_data: {},
        };

        years.forEach((year: any) => {
            result.yearly_data[year.year] = 0;
        });

        branches.forEach((branch: any) => {
            result.branch_wise_data[branch.branch] = 0;
        });

        users.forEach((user: User) => {
            if (user.year && result.yearly_data[user.year] !== undefined) {
                result.yearly_data[user.year]++;
            }

            if (user.branch && result.branch_wise_data[user.branch] !== undefined) {
                result.branch_wise_data[user.branch]++;
            }
        });

        result["users_count"] = users.length;
        return new Response(JSON.stringify(result), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                status: "failure",
                error: error.message,
            }),
            {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            },
        );
    }
}

export async function POST(req: Request) {
    const { data, eventId } = await req.json();
    if (!data || !eventId) {
        return new Response("Invalid request", {
            status: 400,
        });
    }
    const csv_parsed = csvParseRows(data);
    csv_parsed.shift();
    let start_time = new Date();
    let processed = csv_parsed.map((row) => process_users(row)) as User[];

    await db.user.createMany({
        data: processed,
        skipDuplicates: true,
    });
    const users = await db.user.findMany({});
    const attendance = users.map((user: User) => ({
        eventsId: eventId,
        userId: user.id!,
    }));

    await db.attendance.createMany({
        data: attendance,
        skipDuplicates: true,
    });

    let end_time = new Date();
    console.log("Start time: ", start_time);
    console.log("End time: ", end_time);
    return new Response("ok");
}
