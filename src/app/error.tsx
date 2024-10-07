"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@vibrance/components/Loading";

interface LoginProps {
    email: string;
    password: string;
}

export default function LoginComponent() {
    const router = useRouter();
    const [credentials, setCredentials] = useState<LoginProps>({
        email: "",
        password: "",
    });

    const { status } = useSession();

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "authenticated") {
        router.push("/admin");
    }
    if (status === "unauthenticated") {
        return (
            <section className="grid grid-cols-10 gap-4 py-2">
                <section className="col-start-4 col-span-4 py-16">
                    <section className="mt-2 font-bold tracking-tight text-4xl scroll-m-20 border-b pb-2 first:mt-0">
                        Login to continue to admin !
                    </section>
                    <section className="my-2 font-semibold tracking-tight text-xl">
                        Prototype 1.0
                    </section>
                    <section className="text-red-500">
                        Invalid credentials/Permissions
                    </section>
                    <section className="pt-4 text-zinc-500 font-regular text-lg tracking-tight leading-tight">
                        This is an admin platform to access and track the prototype app.
                        View insights into the application and track data here.
                    </section>
                    <form className="flex flex-col gap-4 py-4 font-normal">
                        <input
                            className="border-[0.5px] px-2 py-1 rounded-sm border-zinc-500"
                            type="text"
                            placeholder="E-mail"
                            onChange={(e) =>
                                setCredentials({ ...credentials, email: e.target.value })
                            }
                        />
                        <input
                            className="border-[0.5px] px-2 py-1 rounded-sm border-zinc-500"
                            type="password"
                            placeholder="Password"
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    password: e.target.value,
                                })
                            }
                        />
                    </form>
                    <button
                        className="bg-zinc-900 text-white py-2 px-4 rounded-md font-regular text-lg"
                        onClick={() => {
                            signIn("credentials", {
                                email: credentials.email,
                                password: credentials.password,
                            });
                        }}
                    >
                        Login
                    </button>
                </section>
            </section>
        );
    }
}
