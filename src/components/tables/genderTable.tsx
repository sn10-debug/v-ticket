"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Loading from "@vibrance/components/Loading";

interface RemainingData {
	platinum: {
		Male: number;
		Female: number;
	};
	gold: {
		Male: number;
		Female: number;
	};
	silver: {
		Male: number;
		Female: number;
	};
}

export default function GenderTable() {
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<RemainingData>();

	useEffect(() => {
		const fetchStudents = async () => {
			const response = await fetch("/api/remaining");
			const data = await response.json();
			setData(data);
		};

		setTimeout(() => fetchStudents(), 15 * 1000)
	}, []);

	return (
		<Table className="text-left max-h-screen overflow-y-scroll">
			<TableHeader>
				<TableRow className="border border-b-[1px] text-md">
					<TableCell className="text-center font-bold text-md  border-r-[2px]">
						Gender
					</TableCell>
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Platinum
					</TableCell>
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Gold
					</TableCell>
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Silver
					</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody className="font-normal text-md text-center">
				<TableRow className="border">
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						Boys
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.platinum.Male}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.gold.Male}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.silver.Male}
					</TableCell>
				</TableRow>
				<TableRow className="font-normal border">
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						Girls
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.platinum.Female}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.gold.Female}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{data?.silver.Female}
					</TableCell>{" "}
				</TableRow>
				<TableRow className="border">
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Total
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						1914
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						2001
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						2018
					</TableCell>
				</TableRow>
				<TableRow className="border">
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Boys Remaining
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{1460 - data?.platinum?.Male!}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{1184 - data?.gold?.Male!}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{946 - data?.silver?.Male!}
					</TableCell>
				</TableRow>
				<TableRow className="border">
					<TableCell className="font-bold text-md  border-r-[2px] text-center">
						Girls Remaining
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{454 - data?.platinum?.Female!}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{817 - data?.gold?.Female!}
					</TableCell>
					<TableCell className="font-normal text-md  border-r-[2px] text-center">
						{1072 - data?.silver?.Female!}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
