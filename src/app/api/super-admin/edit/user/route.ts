import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    try {
        const {
            reg_no,
            name,
            email,
            phone,
            paidStatus,
            year,
            broken,
            serial_id,
            branch,
            id,
        } = await req.json();

        await db.user.update({
            where: { id },
            data: {
                reg_no,
                name,
                email,
                phone,
                year,
                broken,
                serial_id,
                branch,
            },
        });

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
