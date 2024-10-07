
import { db } from "@vibrance/server/db";

import { verify } from "jsonwebtoken";

async function handleProShow(user: any, validater: any, data: any, overallEvent: any) {
    let proShows = data.filter((event: any) => event.eventName.includes("Proshow") && event.paymentStatus === "PAID")

    if (proShows.length === 0) {
        return {
            status: "failure",
            message: "User not registered for the event"

        }

    }

    let event = proShows[0]

    let eventName = event.eventName;

    let vibranceID = event.eventId

    let databaseEvent = await db.events.findFirst({
        where: {
            vibranceID
        }
    })

    let attendance = await db.attendance.findFirst({
        where: {
            userId: user.id,
            eventsId: databaseEvent?.id
        }
    })

    if (attendance) {

        return {
            status: "failure",
            message: "Already User Mapped"
        }
    }


    // Mapping with the Overall Proshow Event
    await db.attendance.create({
        data: {
            userId: user.id,
            eventsId: overallEvent.id as string
        }
    })

    // Mapping with the Specific Proshow Event
    await db.attendance.create({

        data: {
            userId: user.id,
            eventsId: databaseEvent?.id as string
        }
    })


    await db.log.create({
        data: {
            action: "Create",
            message: user.name + " with serial number " + user.serial_id + " mapped to " + eventName + " by " + validater.name,

            userId: validater.id
        }
    })

    return {
        status: "success",
        message: "User Mapped",
        eventName,
        userName: user.name,
        user
    }

}
export async function POST(req: Request) {

    let { serialNo, token, eventID, validater } = await req.json();
    let decoded = verify(token, process.env.NEXTAUTH_SECRET!);


    // @ts-ignore   
    if (decoded.exp < Date.now() / 1000) {
        return new Response("Token expired", {
            status: 401,
        });
    }


    let user = await db.user.findUnique({
        where: {
            // @ts-ignore
            serial_id: serialNo,
        }
    })

    validater = await db.user.findUnique({
        where: {
            // @ts-ignore
            id: validater
        }
    })

    if (user) {
        // Collect all the events
        let attendance = await db.attendance.findFirst({
            where: {
                userId: user.id,
                eventsId: eventID
            }
        })


        if (attendance) {

            return new Response(JSON.stringify({
                status: "failure",
                message: "User already Mapped"
            }))
        } else {


            let data = await fetch("https://chennaievents.vit.ac.in/vitchennai_vibrance/proshowStatus", {


                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cardNo: serialNo,
                    accessUser: "VibranceProshowAccess",
                    accessKey: "V!brance@#$32!",
                }),
            })


            const responseData = await data.json() as any[]

            let event = await db.events.findUnique({
                where: {
                    id: eventID
                }
            })

            // if the event is a Proshow let the handleProshowFunction Handle


            if (event?.name?.includes("Proshow")) {

                let result = await handleProShow(user, validater, responseData, event)

                return new Response(JSON.stringify({
                    ...result
                }))

            }



            // This checks whether the person is registered for the event or not




            let registeredEvent = responseData.filter((regEvent: any) => regEvent.eventId === event?.vibranceID)



            let registered = registeredEvent.length > 0 ? true : false

            if (!registered) {
                return new Response(JSON.stringify({
                    status: "failure",
                    message: "User not registered for the event"
                }))
            }

            if (registeredEvent[0].paymentStatus === "UNPAID") {

                return new Response(JSON.stringify({
                    status: "failure",
                    message: "User not Paid for the event"
                }))
            }




            let attendance = await db.attendance.create({
                data: {
                    userId: user.id,
                    eventsId: eventID,
                }
            })





            await db.log.create({
                data: {
                    action: "Create",
                    message: user.name + " with serial number " + serialNo + " mapped to " + event?.name + " by " + validater.name,

                    userId: validater.id
                }
            })


            return new Response(JSON.stringify({
                status: "success",
                message: "User Mapped",
                eventName: event?.name,
                userName: user.name,
                user
            }))
        }
    }


    else {
        let data = await fetch("https://chennaievents.vit.ac.in/vitchennai_vibrance/proshowStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cardNo: serialNo,
                accessUser: "VibranceProshowAccess",
                accessKey: "V!brance@#$32!",
            }),
        })

        const responseData = await data.json() as any[]
        let userDetails = {
            reg_no: responseData[0].regNo,
            name: responseData[0].name,
            email: responseData[0].email,
            serial_id: responseData[0].cardNo,
            phone: responseData[0].phNo,
            gender: responseData[0].gender

        }


        let user = await db.user.create({
            data: userDetails
        })

        let event = await db.events.findUnique({
            where: {
                id: eventID
            }
        })

        if (event?.name?.includes("Proshow")) {
            let result = await handleProShow(user, validater, responseData, event)
            return new Response(JSON.stringify({
                ...result
            }))

        }

        let registeredEvent = responseData.filter((regEvent: any) => regEvent.eventId === event?.vibranceID)
        let registered = registeredEvent.length > 0 ? true : false

        if (!registered) {
            return new Response(JSON.stringify({
                status: "failure",
                message: "User not registered for the event"
            }))
        }

        if (registeredEvent[0].paymentStatus === "UNPAID") {
            return new Response(JSON.stringify({
                status: "failure",
                message: "User not Paid for the event"
            }))
        }

        let attendance = await db.attendance.create({
            data: {
                userId: user.id,
                eventsId: eventID,
            }
        })

        await db.log.create({
            data: {
                action: "Create",
                message: user.name + " with serial number " + serialNo + " mapped to " + event?.name + " by " + validater.name,

                userId: validater.id
            }
        })


        return new Response(JSON.stringify({
            status: "success",
            message: "User Mapped",
            eventName: event?.name,
            userName: user.name,
            user
        }))

    }
}