import { db } from "@vibrance/server/db";
export async function POST(req: Request) {
    const { token, serialNo, eventID, verifyingUser } = await req.json();

    if (token == "" || serialNo == "") {
        return new Response("Missing field", {
            status: 401,
        });
    }


    const verifyer=await db.user.findFirst({
        where:{
            id:verifyingUser
        }
    })


    

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

    let attendance = await db.attendance.findFirst({
        where: {
            eventsId: eventID,
            userId: user?.id,
        },
    });


    if(!attendance){
        return new Response(
            JSON.stringify({
                status: 403,
                message: "User not registered for the event",
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
    
    let event = await db.events.findUnique({
        where: {
            id: eventID,
        },
    });

    let specificProwShowAttendance=null
    if(event?.name?.includes("Proshow")){



        
        let proshowAttendances=await db.attendance.findMany({
            where:{
                userId:user.id
            },
            select:{
                id:true,
                eventsId:true,
                userId:true,
                event:{
                    select:{
                        name:true,
                        vibranceID:true
                    }
                
                }
            }
        })

        specificProwShowAttendance=proshowAttendances.filter((attendance:any)=>{
            return attendance.eventsId!=eventID && attendance?.event?.name?.includes("Proshow")
        })


        attendance=specificProwShowAttendance[0] ? specificProwShowAttendance[0] : null

        if(specificProwShowAttendance[0]!==null){
        event=await db.events.findFirst({
            where:{
               id:specificProwShowAttendance[0]?.eventsId
            }
        
        })
    }
    }
   
    if (attendance) {

        let eventName=specificProwShowAttendance ? specificProwShowAttendance[0]?.event.name : null

        // if(eventName==="Proshow-Platinum-Solo"){
        //     if(verifyer?.branch!=="Platinum"){
        //         return new Response(JSON.stringify({
        //             status:403,
        //             message:"Staff Not allowed to verify"
        //         }))
        //     }
        // }
        // else if(eventName==="Proshow-Gold-Solo"){
        //     if(verifyer?.branch!=="Gold"){
        //         return new Response(JSON.stringify({
        //             status:403,
        //             message:"Staff Not allowed to verify"
        //         }))
        //     }
        // }else if(eventName==="Proshow-Silver-Solo"){
        //     if(verifyer?.branch!=="Silver"){
        //         return new Response(JSON.stringify({
        //             status:403,
        //             message:"Staff Not allowed to verify"
        //         }))
        //     }
        // }

        let check = await db.inOutTime.findFirst({
            where: {
                attendanceId: attendance.id,
                verifyingUserId: verifyingUser,
            },
            orderBy: {
                inTime: "desc",
            },
        });
        let time = new Date();
        let intime = new Date(check?.inTime!);
        let delta = time.valueOf() - intime.valueOf();
        if (delta < 5 * 60 * 1000) {
            return new Response(
                JSON.stringify({
                    status: 403,
                    message: "Already verified , cool down for 5 minutes",
                }),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        let validater = await db.user.findFirst({
            where: {
                id: verifyingUser,
            },
        });

        await db.inOutTime.create({
            data: {
                attendanceId: attendance.id,
                inTime: new Date(),
                verifyingUserId: verifyingUser,
            },
        });



        let status='2'
        let today=new Date()

        if(today.getDate()===6) status='2'
        else if(today.getDate()===7) status='3'
        else if(today.getDate()===8) status='4'
        else if(today.getDate()===9) status='5' 
        const sdc_data=await fetch("https://chennaievents.vit.ac.in/vitchennai_vibrance/proshowResponse",{
            method:"POST",
            body:JSON.stringify({
                "cardNo": user.serial_id ? user.serial_id : null,
    "accessUser": "VibranceProshowAccess",
    "accessKey": "V!brance@#$32!",
    "registerNo" :user.reg_no,
    "status":status,
    "eventId":specificProwShowAttendance ? specificProwShowAttendance[0]?.event.vibranceID : null
            })
        })

        await db.log.create({
            data: {
                userId: verifyingUser,
                action: "Verify",
                message: validater?.name+ " verified " + user?.name + " for " + event?.name,
            },
        });

        return new Response(
            JSON.stringify({
                status: 200,
                message: "success",
                name: user.name,
                reg_no:user.reg_no,
                category: event?.name,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } else {
        return new Response(
            JSON.stringify({
                status: 403,
                message: "User not registered for the event",
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
