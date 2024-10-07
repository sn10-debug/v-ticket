import { db } from "@vibrance/server/db";
import type { User } from "@prisma/client";

export async function POST(req: Request) {
    let { user } = await req.json();
    if (user.id == null) {
        return new Response(
            JSON.stringify({
                message: "User id is required",
            }),
            {
                status: 400,
            },
        );
    }
    user = await db.user.findUnique({
        where: {
            id: user.id,
        },
    });
    if (!(user.role == "SuperAdmin")) {
        return new Response(
            JSON.stringify({
                message: "You are not allowed to generate super secret",
            }),
            {
                status: 400,
            },
        );
    }

    let super_admins = await db.user.findMany({
        where: {
            role: "SuperAdmin",
        },
    });
    let random_secrets: string[] = [];

    for (let i = 0; i < super_admins.length; i++) {
        let random_secret = Math.floor(Math.random() * 99999 + 10000).toString();
        random_secrets.push(random_secret);
    }

    await Promise.all(
        super_admins.map(async (super_admin: User, index: number) => {
            await db.user.update({
                where: {
                    id: super_admin.id,
                },
                data: {
                    super_secret: random_secrets[index],
                },
            });
        }),
    );

    return new Response(
        JSON.stringify({
            message: "Super Secret generated successfully",
            secrets: random_secrets,
        }),
    );
}
