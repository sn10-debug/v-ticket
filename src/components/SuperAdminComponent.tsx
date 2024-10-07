import { Button } from "@shadui/button";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";

interface HrefComponentProps {
    link: string;
    name: string;
    isCurrent: boolean;
}

/// They're all engineers?

const HrefComponent = (props: HrefComponentProps) => {
    return (
        <Link
            className={
                " inline-flex items-center px-1 pt-1 border-b-2 font-semibold text-md " +
                clsx(
                    props.isCurrent
                        ? "border-blue-700 text-gray-800"
                        : "border-gray-200/65 text-zinc-500/85 hover:border-gray-500 hover:text-zinc-950",
                )
            }
            href={props.link}
        >
            {props.name}
        </Link>
    );
};

export default function NavbarComponent() {
    const router = useRouter();
    const routes = [
        {
            name: "Analytics",
            link: "/admin/analytics",
        },
        {
            name: "Create event",
            link: "/admin/add-an-event",
        },
        {
            name: "Bulk upload",
            link: "/admin/upload",
        },
        {
            name: "View database",
            link: "/admin/database",
        },
        {
            name: "Staff users",
            link: "/admin/staff",
        },
    ];

    const path = usePathname();
    const currentIndex = routes.findIndex((route) => {
        const routeRegex = new RegExp(`^${route.link}(\/|$)`);
        return path.match(routeRegex);
    });

    return (
        <nav className="bg-slate-50/50 shadow">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="flex justify-between h-20">
                    <section className="flex">
                        <section className="flex-shrink-0 flex items-center">
                            <Link
                                href="/admin"
                                className="hover:bg-zinc-200/85 rounded-full"
                            >
                                <img
                                    alt="Vibrance Logo"
                                    className="block lg:hidden h-20 w-auto"
                                    src="/icon.png"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    width="64"
                                />
                                <img
                                    alt="Vibrance Logo"
                                    className="hidden lg:block h-20 w-auto"
                                    src="/icon.png"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    width="64"
                                />
                            </Link>
                        </section>
                        <section className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {routes.map((route, index) => (
                                <HrefComponent
                                    key={index}
                                    name={route.name}
                                    link={route.link}
                                    isCurrent={index === currentIndex}
                                />
                            ))}
                        </section>
                    </section>
                    <Button
                        className="font-semibold text-md inline-flex items-center text-gray-500 shadow-none hover:text-gray-900 hover:bg-gray-200/65 mx-4 my-5 p-2 rounded-full"
                        onClick={() => {
                            signOut();
                            router.push("/");
                        }}
                    >
                        <BiLogOut className="inline-block rounded text-2xl" />
                    </Button>
                </section>
            </section>
        </nav>
    );
}
