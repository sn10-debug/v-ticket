import { User } from "@prisma/client";
import type { BranchData, TemproaryUser, InterStudent } from "@vibrance/types/analytics";

export const computeBranchData = (
    branchData: BranchData,
    sliceStart: number,
    sliceEnd: number,
    user: TemproaryUser,
) => {
    const branch = `${user?.reg_no?.slice(sliceStart, sliceEnd)}`;

    if (branch in branchData) {
        branchData[branch]++;
    } else {
        branchData[branch] = 1;
    }
    return branchData;
};

export const computeYearlyData = (
    yearlyData: BranchData,
    sliceStart: number,
    sliceEnd: number,
    user: TemproaryUser,
) => {
    const year = `20${user?.reg_no?.slice(sliceStart, sliceEnd)}`;

    if (year in yearlyData) {
        yearlyData[year]++;
    } else {
        yearlyData[year] = 1;
    }
    return yearlyData;
};

export const processStudents = (
    branchSplice: [number, number],
    yearSplice: [number, number],
    user: InterStudent[],
) => {
    const result = {
        branch: {},
        yearly: {},
        total: 0,
    };
    const yearly = new Map<string, InterStudent[]>();
    const branches: any = {};
    result.total = user.length;

    user.forEach((user: InterStudent) => {
        const branch = user?.reg_no?.slice(branchSplice[0], branchSplice[1]);
        const year = user?.reg_no?.slice(yearSplice[0], yearSplice[1]);

        if (branch! in branches) {
            branches[branch!].push(user);
        } else {
            branches[branch!] = [user];
        }

        if (yearly.has(year!)) {
            yearly.set(year!, [...yearly.get(year!)!, user]);
        } else {
            yearly.set(year!, [user]);
        }
    });
    result.branch = branches;
    result.yearly = Object.fromEntries(yearly);
    return result;
};
