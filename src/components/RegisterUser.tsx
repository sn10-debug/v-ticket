"use client";
import { Button } from "@shadui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface StaffUserProps {
    email: string;
    password: string;
    confirm_password: string;
    reg_no: string;
    name: string;
    createdBy: any;
}

export default function RegisterStaffUser(): JSX.Element {
    const session = useSession();
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"success" | "error" | "">("");
    const [staffUser, setStaffUser] = useState<StaffUserProps>({
        email: "",
        password: "",
        confirm_password: "",
        reg_no: "",
        name: "",
        createdBy: session?.data?.user,
    });

    const [error, setError] = useState(false);

    const Handle = async () => {
        setError(false);
        if (
            staffUser.email === "" ||
            staffUser.password === "" ||
            staffUser.confirm_password === "" ||
            staffUser.reg_no === "" ||
            staffUser.name === ""
        ) {
            setError(true);
            setMessage("Please fill all the fields");
            return;
        }

        if (staffUser.password !== staffUser.confirm_password) {
            setError(true);
            setMessage("Passwords do not match");
            return;
        }

        if (staffUser.email.indexOf("@") === -1) {
            setError(true);
            setMessage("Invalid email");
            return;
        }

        const res = await fetch("/api/staff", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(staffUser),
        });

        const data = await res.status;
        if (data === 500) {
            setError(true);
            setMessage("Staff user already exists");
            return;
        }
        if (data === 200) {
            setStatus("success");
            setMessage("Staff user created successfully");
        }
    };

    return (
        <section className="grid grid-cols-10 gap-4 py-2 px-4">
            <section className="col-start-2 col-span-8">
                <section className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                    Create a staff user
                </section>
                <h3 className="py-2 scroll-m-20 text-lg font-regular tracking-tight">
                    Create this to allow staff users to login to the portal.
                </h3>
                <section className="border-t-2 border-zinc-400/75 py-4 h-[0.75px]" />
                <form className="bg-slate-100/75 p-2 h-fit rounded-md flex flex-col gap-3">
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Staff email*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setStaffUser({ ...staffUser, email: e.target.value })
                        }
                    />

                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Staff name*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="text"
                        placeholder="Mr Proton"
                        onChange={(e) =>
                            setStaffUser({ ...staffUser, name: e.target.value })
                        }
                    />

                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Staff Register number*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="text"
                        placeholder="21YYYZZZZ"
                        onChange={(e) =>
                            setStaffUser({
                                ...staffUser,
                                reg_no: e.target.value.toUpperCase(),
                            })
                        }
                    />

                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Staff password*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setStaffUser({
                                ...staffUser,
                                password: e.target.value,
                            })
                        }
                    />
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                        Confirm staff password*
                    </h4>
                    <input
                        className="h-8 p-1 rounded-sm w-full"
                        type="password"
                        placeholder="Confirm password"
                        onChange={(e) =>
                            setStaffUser({
                                ...staffUser,
                                confirm_password: e.target.value,
                            })
                        }
                    />

                    {error ? (
                        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-red-500">
                            {message}
                        </h4>
                    ) : (
                        <></>
                    )}

                    <section className="flex flex-1 w-full justify-end items-center py-2">
                        <Button
                            className="bg-zinc-900 text-white py-2 px-4 rounded-md font-regular text-md"
                            onClick={(e) => {
                                e.preventDefault();
                                Handle();
                            }}
                        >
                            Submit
                        </Button>
                    </section>
                    {status === "success" ? (
                        <section className="text-green-600 font-semibold text-xl">
                            {message}
                        </section>
                    ) : (
                        <></>
                    )}
                </form>
            </section>
        </section>
    );
}
