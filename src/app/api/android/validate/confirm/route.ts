import { db } from "@vibrance/server/db";
import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
    const { serialNo, token } = await req.json();

    if (serialNo == "") {
        return new Response("Missing field", {
            status: 401,
        });
    }

    let verifyingUser = verify(token, process.env.NEXTAUTH_SECRET!);
    console.log(verifyingUser);

    let user = await db.user.findUnique({
        where: {
            serial_id: serialNo as string,
        },
    });

    if (!user) {
        return new Response(
            JSON.stringify({
                status: 401,
                message: "Wrong serial number",
            }),
            {
                status: 401,
            },
        );
    }

    await db.user.update({
        where: {
            serial_id: serialNo as string,
        },
        data: {
            isValidated: true,
        },
    });

    await db.log.create({
        data: {
            message: `User ${user.name} with serial number ${serialNo} has been validated`,
            action: "Verify",
            // @ts-ignore
            userId: verifyingUser.userId,
        }
    })

    return new Response(
        JSON.stringify({
            status: 200,
            message: "Validation updated successfully!",
            data: user,
        }),
        {
            status: 200,
        },
    );
}
