import { db } from "@vibrance/server/db";
import convert from "@vibrance/server/pass";

export async function POST(req: Request) {
    try {
        const { email, name, password, reg_no, createdBy } = await req.json();

        // Check for missing fields
        if (!email || !name || !password || !reg_no) {
            return new Response("Missing required fields", { status: 401 });
        }

        let user = await db.user.create({
            data: {
                email,
                name,
                reg_no,
                password: convert(password),
                role: "Staff",
            },
        });

        await db.log.create({
            data: {
                userId: createdBy.id,
                action: "Create",
                message: "Staff created successfully",
            },
        });

        // Log Generated while creating a staff
        await db.log.create({
            data: {
                userId: user.id,
                action: "Create",
                message: "Staff created",
            },
        });

        return new Response("Ok");
    } catch (error) {
        console.error(error);
        return new Response("An error occurred", { status: 500 });
    }
}
