"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useState } from "react";
import Footer from "./footer";

export default function UploadFormComponent() {
    const { eventId } = useParams<{ eventId: string }>();
    const [message, setMessage] = useState<string>();
    const [errorStatus, setErrorStatus] = useState<boolean>();

    async function upload(data: FormData) {
        setErrorStatus(false);
        try {
            const file: File | null = data.get("file") as unknown as File;
            if (!file) {
                throw new Error("No file uploaded");
            }
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            await fetch("/api/analytics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: buffer.toString("utf-8"), eventId }),
            });
            setErrorStatus(false);
            setMessage("Upload successful!");
        } catch (error) {
            setErrorStatus(true);
            setMessage(`Upload failed. ${error}`);
        }
    }

    return (
        <>
            <Card className="rounded drop-shadow-sm p-4 h-fit">
                <CardHeader>
                    <CardTitle className="font-semibold text-2xl tracking-tight pt-6 pb-2">
                        Data Bulk Upload
                    </CardTitle>
                    <CardDescription className="font-normal text-md">
                        Upload your CSV file to begin the bulk upload process.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" action={upload}>
                        <section className="grid w-full max-w-sm items-center gap-1.5 py-4">
                            <Label htmlFor="file">CSV File</Label>
                            <Input
                                accept=".csv"
                                className="p-2"
                                type="file"
                                name="file"
                            />
                        </section>
                        <Button
                            type="submit"
                            value="Upload"
                            className="rounded bg-zinc-950 text-gray-50"
                        >
                            Upload
                        </Button>
                        {errorStatus ? (
                            <section className="text-red-500 text-center font-semibold text-lg">
                                {message}
                            </section>
                        ) : (
                            <section className="text-green-600 text-center font-semibold text-lg">
                                {message}
                            </section>
                        )}
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
