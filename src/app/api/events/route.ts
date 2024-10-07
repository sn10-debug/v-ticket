import { db } from "@vibrance/server/db";

export async function GET(req: Request) {
    const events = await db.events.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            venue: true,
            date: true,
        },
    });
    return new Response(JSON.stringify(events));
}

export async function POST(req: Request) {
    const response = await req.json();
    console.log(req);

    const event = await db.events.create({
        data: {
            name: response.eventName,
            description: response.eventDescription,
            venue: response.eventVenue,
            date: new Date(response.eventDate).toISOString(),
        },
    });

    const log = await db.log.create({
        data: {
            userId: response.user.id,
            action: "Create",
            message: "Event created successfully",
        },
    });

    return new Response(
        JSON.stringify({
            message: "Event created successfully",
            eventId: event.id,
            log: log.id,
        }),
    );
}
