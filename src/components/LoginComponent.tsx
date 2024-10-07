"use client";

import { Button } from "@shadui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@shadui/card";
import { Input } from "@shadui/input";
import Loading from "@vibrance/components/Loading";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginProps {
    email: string;
    password: string;
}

export default function LoginComponent() {
    const handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            signIn("credentials", {
                email: credentials.email,
                password: credentials.password,
            });
        }
    };

    const [credentials, setCredentials] = useState<LoginProps>({
        email: "",
        password: "",
    });
    const router = useRouter();
    const { status, data } = useSession();

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "authenticated") {
        if (data?.user.role === "Admin") {
            router.push("/admin");
        } else if (data?.user.role === "SuperAdmin") {
            router.push("/super-admin");
        }
    }

    if (status === "unauthenticated") {
        return (
            <section
                onKeyDown={handleKeyPress}
                className="min-h-screen flex flex-col items-center justify-center"
            >
                <Card className="rounded-md p-4">
                    <CardHeader>
                        <CardTitle className="text-2xl py-2 font-bold">
                            Admin Login
                        </CardTitle>
                        <CardDescription className="text-md font-semibold py-1">
                            Please enter your email and password to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <section className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                className="rounded p-2"
                                placeholder="admin@vit.com"
                                required
                                type="email"
                                onChange={(e) => {
                                    setCredentials({
                                        ...credentials,
                                        email: e.target.value,
                                    });
                                }}
                            />
                        </section>
                        <section className="space-y-2 pb-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                className="rounded p-2"
                                placeholder="Shush🤫!"
                                required
                                type="password"
                                onChange={(e) => {
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value,
                                    });
                                }}
                            />
                        </section>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center py-2">
                        <Button
                            className="w-auto bg-zinc-950 hover:bg-zinc-700 text-white"
                            onClick={() => {
                                signIn("credentials", {
                                    email: credentials.email,
                                    password: credentials.password,
                                });
                            }}
                        >
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </section>
        );
    }
}
