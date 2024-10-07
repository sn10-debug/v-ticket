import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    let { email, name, regNo, password, confirmPassword, role } = await req.json();

    if (role == 0) {
        role = "Admin";
    }

    if (role == 1) {
        role = "Staff";
    }

    try {
        const user = await db.user.create({
            data: {
                email,
                name,
                password,
                role,
            },
        });

        return new Response(
            JSON.stringify({
                message: "User created sucessfully",
            }),
            {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                status: 400,
                message: "User creation failed",
            }),
            {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            },
        );
    }
}
