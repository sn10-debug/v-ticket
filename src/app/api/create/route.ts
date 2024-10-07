import { db } from "@vibrance/server/db"

export async function POST(req:Request){
    try{

    let {serial_id}=await req.json()

    let user=await db.user.findFirst({
        where:{
            serial_id
        }
    })


    const attendance=await db.attendance.create({
        data:{
            eventsId:"c95a455b-bf8e-4c45-bb4f-2ee0a896f81c",
            userId:user?.id
        }
    })


    const attendance2=await db.attendance.create({
        data:{
            eventsId:"1c6809d0-d156-42cd-bc09-5713ca50ca5e",
            userId:user?.id
        }
    })


    return new Response(JSON.stringify({
        status:"success",
        message:"Successfully created"
    }))

}catch(err){
    return new Response(JSON.stringify({
        status:"failure",
        error:err
    }))
}



}