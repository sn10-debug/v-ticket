import { db } from "@vibrance/server/db"


export async function GET(req: Request) {

    const platinum = await db.$queryRaw`SELECT  gender, COUNT(DISTINCT reg_no)  FROM "intimeview_gender" WHERE eventname='Proshow-Platinum-Solo' AND intime_entry >= '2024-03-07' GROUP BY gender;`
    const gold = await db.$queryRaw`SELECT gender, COUNT(DISTINCT reg_no)  FROM "intimeview_gender" WHERE eventname='Proshow-Gold-Solo' AND intime_entry >= '2024-03-07' GROUP BY gender;`
    const silver = await db.$queryRaw`SELECT gender, COUNT(DISTINCT reg_no)  FROM "intimeview_gender" WHERE eventname='Proshow-Silver-Solo' AND intime_entry >= '2024-03-07' GROUP BY gender;`

    let body = {
        platinum: {
            Male: 0,
            Female: 0
        },
        gold: {
            Male: 0,
            Female: 0
        },
        silver: {
            Male: 0,
            Female: 0
        }
    }

    platinum.forEach((row: any) => {
        if (row.gender === 'MALE') {
            body['platinum']['Male'] = parseInt(row.count)
        }
        else if (row.gender === 'FEMALE') {
            body['platinum']['Female'] = parseInt(row.count)
        }
    })

    gold.forEach((row: any) => {
        if (row.gender === 'MALE') {
            body['gold']['Male'] = parseInt(row.count)
        }
        else if (row.gender === 'FEMALE') {
            body['gold']['Female'] = parseInt(row.count)
        }
    })

    silver.forEach((row: any) => {
        if (row.gender === 'MALE') {
            body['silver']['Male'] = parseInt(row.count)
        }
        else if (row.gender === 'FEMALE') {
            body['silver']['Female'] = parseInt(row.count)
        }
    })

    return new Response(JSON.stringify(body))
}