import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    const { user, newAccount } = await req.json();

    try {
        await db.user.create({
            data: {
                email: newAccount.email,
                name: newAccount.name,
                reg_no: newAccount.reg_no,
                password: newAccount.password,
                role: "Student",
            },
        });

        await db.log.create({
            data: {
                userId: user.id,
                action: "Create",
                message: "New User created successfully",
            },
        });

        return new Response("Ok");
    } catch (error) {
        console.error(error);
        return new Response("An error occurred", { status: 500 });
    }
}
