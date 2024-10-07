import { db } from "@vibrance/server/db"
export async function POST(req:Request){

    try{
    let {reg_no}=await req.json()
    let user=await db.user.findFirst({
        where:{
            reg_no
        }
    })


    
    let proshowAttendances=await db.attendance.findMany({
        where:{
            userId:user?.id
        },
        select:{
            id:true,
            eventsId:true,
            userId:true,
            event:{
                select:{
                    name:true
                }
            
            }
        }
    })



    let specificProwShowAttendance=proshowAttendances?.find((attendance:any)=>{
        return attendance?.event?.name?.includes("Proshow-")
    })


    if(specificProwShowAttendance){
            
        // Find the InOut


            let inout=await db.inOutTime.findFirst({
                where:{
                    attendanceId:specificProwShowAttendance.id
                }
            })



            if(inout){

                const date=new Date(inout.inTime)
                const formattedDate = new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "Asia/Kolkata",
            }).format(date);
            const today=new Date()

            const now=new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "Asia/Kolkata",
            }).format(today);


            if(today.getDate() === date.getDate()){


                if(date.getDate()<6){
                    return new Response(JSON.stringify({
                        status:"failure",
                        message:"Event hasn't been started"
                    }))
                }
                else if(date.getDate()==6){
                    return new Response(JSON.stringify({
                        cardNo:user?.serial_id,
                        "accessUser": "VibranceProshowAccess",
                        "accessKey": "V!brance@#$32!",
                        "registerNo":user?.reg_no,
                        status: "2",
                        present:true
                    }))
                }
                else if(date.getDate()==7){
                    return new Response(JSON.stringify({
                        cardNo:user?.serial_id,
                        "accessUser": "VibranceProshowAccess",
                        "accessKey": "V!brance@#$32!",
                        "registerNo":user?.reg_no,
                        status: "3",
                        present:true
                    }))
                }else if(date.getDate()==8){
                    return new Response(JSON.stringify({
                        cardNo:user?.serial_id,
                        "accessUser": "VibranceProshowAccess",
                        "accessKey": "V!brance@#$32!",
                        "registerNo":user?.reg_no,
                        status: "4",
                        present:true
                    }))
                }else if(date.getDate()===9){
                    return new Response(JSON.stringify({
                        cardNo:user?.serial_id,
                        "accessUser": "VibranceProshowAccess",
                        "accessKey": "V!brance@#$32!",
                        "registerNo":user?.reg_no,
                        status: "5",
                        present:true
                    }))
                }else{
                    return new Response(JSON.stringify({
                        status:"failure",
                        message:"Days Exceeded"
                    }))
                }
            }
            

        }else{
            return new Response(JSON.stringify({
                status:"failure",
                message:"User hasn't marked for the day"
            }))
        }
    }else{
        return new Response(JSON.stringify({
            status:"failure",
            message:"User not registered for the event"
        }))
    }
    }catch(err){

        return new Response(JSON.stringify({
            status:"failure",
            error:err
        }))
    }

}