import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    try {
        const { name, description, venue, date } = await req.json();
        console.log(name, description, venue, date);
        // await db.events.update({})

        return new Response(
            JSON.stringify({ message: "Student data updated successfully" }),
        );
    } catch (error) {
        console.error("Error updating students:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
