import { db } from "@vibrance/server/db";

export async function POST(req: Request) {
    let { profile, user } = await req.json();
    console.log(profile);
    console.log(user);

    let userExist = await db.user.findUnique({
        where: {
            reg_no: profile.reg_no,
        },
    });

    if (userExist) {
        return new Response("User Already exits", { status: 404 });
    }

    user = await db.user.create({
        data: {
            ...profile,
        },
    });

    await db.log.create({
        data: {
            userId: user.id,
            action: "Create",
            message: "User Created : " + user.reg_no,
        },
    });

    return new Response(JSON.stringify(user), { status: 200 });
}
