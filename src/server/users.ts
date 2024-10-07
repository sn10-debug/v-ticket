import { BulkUpload, User } from "@vibrance/types/uploads";
import { randomUUID } from "crypto";

export const process_users = (row: string[]) => {
    const record = {
        idx: parseInt(row[0]!),
        teamid: parseInt(row[1]!),
        teamname: row[2]!,
        regno: row[3]!.toUpperCase(),
        name: row[4]!,
        email: row[5]!,
        phone: row[6]!,
        college: row[7]!,
        accepted: row[8]!,
        timestamp: row[9]!,
    } as BulkUpload;

    const user = {
        name: record.name,
        id: randomUUID(),
        email: record.email,
        phone: record.phone,
        reg_no: record.regno,
        branch: record.regno.slice(2, 5),
        year: record.regno.slice(0, 2),
    } as User;

    return user;
};
