import { db } from "@vibrance/server/db"

export async function POST(req:Request){

    try{
    let {reg_no}=await req.json()
    let user=await db.user.findFirst({
        where:{
            reg_no
        }
    })


    let proshowAttendance=await db.attendance.findFirst({
        where:{
            userId:user?.id,
            eventsId:"c95a455b-bf8e-4c45-bb4f-2ee0a896f81c"
        }
    })



    let delivered=false

    let validationError=false

    if(proshowAttendance){
        delivered=true
    }

    
        let ticket=await db.tickets.findFirst({
            where:{
               reg_no:reg_no,
                title:"Custom",
               }
        })
        console.log(ticket)

      
        if(ticket?.description.toLowerCase().trim()==="validation error") validationError=true
        
    

    // 6 for not delivered

    return new Response (JSON.stringify({
        cardNo:user?.serial_id,
        "accessUser": "VibranceProshowAccess",
        "accessKey": "V!brance@#$32!",
        registerNo:user ? user?.reg_no : reg_no ,
        status: validationError && delivered ? "0":(delivered ? "1":"6"),
        deliveredStatus:delivered,
        validationErrorStatus:validationError
    }))
}catch(err){


    return new Response(JSON.stringify({
        status:"failure",
        error:err
    }))

}


}