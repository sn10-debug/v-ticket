export interface BulkUpload {
    idx: number;
    teamid: number;
    teamname: string;
    regno: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    accepted: string;
    timestamp: string;
    gender?: string;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    reg_no: string;
    branch: string;
    year: string;
}
