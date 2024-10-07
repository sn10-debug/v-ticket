import { db } from "@vibrance/server/db";

export async function GET(req: Request) {
    const currentUTC = new Date();
    const currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);

    const inout = await db.inOutTime.findMany({
        where: {
            inTime: {
                lte: currentIST,
            },
        },
    });

    const result = {
        time: currentUTC.toLocaleTimeString("en-IN", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Kolkata",
        }),
        size: inout.length,
    };
    
    return new Response(JSON.stringify(result));
}
