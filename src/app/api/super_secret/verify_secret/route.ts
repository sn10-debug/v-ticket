import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    let { secret } = await req.json();

    let superAdmins = await db.user.findMany({
        where: {
            role: "SuperAdmin",
        },
    });

    let superSecrets = superAdmins.map((superAdmin: any) => superAdmin.super_secret);

    if (!superSecrets.includes(secret)) {
        return new Response(
            JSON.stringify({
                message: "Invalid secret",
            }),
            {
                status: 400,
            },
        );
    }

    let userIndex = superSecrets.indexOf(secret);

    let superAdminApproved = superAdmins[userIndex];

    await db.log.create({
        data: {
            userId: superAdminApproved ? superAdminApproved.id : "user_not_exists",
            action: "Verify",
            message: "SuperAdmin verified",
        },
    });

    return new Response(
        JSON.stringify({
            message: "SuperAdmin approved",
            superAdmin: superAdminApproved,
        }),
        {
            status: 200,
        },
    );
}
