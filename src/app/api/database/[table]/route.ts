import { db } from "@vibrance/server/db";

export async function GET(req: Request, { params }: { params: { table: string } }) {
    const { table } = params;

    let data;

    switch (table) {
        case "user":
            data = await db.user.findMany(
                {
                where: {
                    role: "Student",
                },
            });
            break;
        case "events":
            data = await db.events.findMany({
                select: {
                    name: true,
                    description: true,
                    venue: true,
                    date: true,
                },
            });
            break;

        case "log":
            data = await db.log.findMany({
                select: {
                    id: true,
                    userId: true,
                    action: true,
                    message: true,
                    timestamp: true,
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });
            break;
        case "attendance":
            data = await db.$queryRaw`
              SELECT * FROM attendance_view
            `;
            break;
        case "InTime":
            data = await db.$queryRaw`
                SELECT * FROM InTimeView
            `;
            break;
        default:
            return new Response("Invalid GET request");
    }

    return new Response(JSON.stringify({ data }));
}
