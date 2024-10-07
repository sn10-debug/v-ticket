export interface BranchData {
    [key: string]: number;
}

export type Result = {
    name: string;
    total: number;
    gender: {
        Boys: number;
        Girls: number;
    };
    yearly: BranchData;
    branch: BranchData;
};

export interface TemproaryUser {
    reg_no: string | null;
    gender: string | null;
}

export type InterStudent = {
    reg_no: string | null;
    name: string | null;
    email: string | null;
    gender: string | null;
    broken: boolean;
};
