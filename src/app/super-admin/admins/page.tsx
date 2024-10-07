"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shadui/select";
import { useState } from "react";
import convert from "@vibrance/server/pass";
import { useSession } from "next-auth/react";

enum Role {
    Admin,
    Staff,
}

interface FormComponents {
    email: string;
    name: string;
    regNo: string;
    password: string;
    confirmPassword: string;
    role: Role;
}

export default function Handler() {
    const [selectedValue, setSelectedValue] = useState<string>("Staff");
    const [check, setCheck] = useState<boolean>(false);
    const [email, setEmail] = useState<boolean>(false);
    const [status, setStatus] = useState<boolean>(false);
    let session = useSession();
    let [successMessage, setSuccessMessage] = useState<string>("");

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
        setFormData({
            ...formData,
            role: value === "Admin" ? Role.Admin : Role.Staff,
        });
    };

    const [formData, setFormData] = useState<FormComponents>({
        email: "",
        name: "",
        regNo: "",
        password: "",
        confirmPassword: "",
        role: Role.Staff,
    });

    const uploadData = async () => {
        let userProfile = {
            email: formData.email,
            name: formData.name,
            reg_no: formData.regNo,
            role: selectedValue,
            password: convert(formData.password),
        };

        let reqBody = {
            profile: userProfile,
            user: session.data?.user,
        };

        let user = await fetch("/api/user/", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (user) {
            setSuccessMessage("User created successfully");
        }

        setFormData({
            email: "",
            name: "",
            regNo: "",
            password: "",
            confirmPassword: "",
            role: Role.Staff,
        });
    };

    return (
        <section className="grid grid-cols-10 gap-4 py-2 px-4">
            <section className="col-start-2 col-span-8">
                <section className="scroll-m-20 text-4xl font-extrabold tracking-tight">
                    Create a staff / admin user
                </section>
                <h3 className="py-2 scroll-m-20 text-lg font-regular tracking-tight">
                    Please fill in the form below to create a staff / admin user.
                </h3>
                <section className="border-t-2 border-zinc-400/75 py-4 h-[0.75px]" />
                <section className="">
                    <Select
                        onValueChange={handleValueChange}
                        defaultValue={selectedValue}
                    >
                        <SelectTrigger className="w-[180px] px-3 py-2 tracking-tight font-semibold">
                            <SelectValue placeholder="Select a table" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="w-[180px] p-2 bg-white z-10">
                                <SelectItem className="p-2" value={"Staff"}>
                                    Staff
                                </SelectItem>
                                <SelectItem className="p-2" value={"Admin"}>
                                    Admin
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </section>
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2">
                    Name*
                </h4>
                <input
                    className="h-8 p-1 rounded-sm w-full border"
                    type="text"
                    placeholder="Name"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                />
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2">
                    Email*
                </h4>
                <input
                    className="h-8 p-1 rounded-sm w-full border"
                    type="text"
                    placeholder="Email"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                />
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2">
                    Register number*
                </h4>
                <input
                    className="h-8 p-1 rounded-sm w-full border"
                    type="text"
                    placeholder="21-XXX-0000"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            regNo: e.target.value,
                        })
                    }
                />
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2">
                    Password*
                </h4>
                <input
                    className="h-8 p-1 rounded-sm w-full border"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value,
                        })
                    }
                />
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2">
                    Confirm Password*
                </h4>
                <input
                    className="h-8 p-1 rounded-sm w-full border"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                        })
                    }
                />
                {check ? (
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2 text-red-500">
                        Passwords do not match
                    </h4>
                ) : null}
                {status ? (
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2 text-green-500">
                        User created successfully
                    </h4>
                ) : null}
                {email ? (
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight py-2 text-red-500">
                        Email already exists
                    </h4>
                ) : null}
                <section className="flex justify-end py-4">
                    <button
                        className="bg-zinc-950 py-2 px-4 rounded text-white font-medium"
                        onClick={uploadData}
                    >
                        Create
                    </button>
                </section>

                <p>{successMessage}</p>
            </section>
        </section>
    );
}
