"use client";
import Loading from "@vibrance/components/Loading";
import SuperAdminNavbarComponent from "@vibrance/components/SuperAdminNavbar";
import "@vibrance/styles/globals.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "unauthenticated") {
        router.push("/");
    }



    if (status === "authenticated") {
        if (session?.user.role === "Admin") {
            router.push("/admin")
        }

        if (session?.user.role === "SuperAdmin") {
            return (
                <>
                    <SuperAdminNavbarComponent />
                    {children}
                </>
            );
        }
    }
}
