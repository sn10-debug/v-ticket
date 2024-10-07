"use client";
import Loading from "@vibrance/components/Loading";
import NavbarComponent from "@vibrance/components/NavbarComponent";
import Footer from "@vibrance/components/footer";
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
        if (session?.user.role === "SuperAdmin") {
            router.push("/super-admin")
        }

        if (session?.user.role === "Admin") {
            return (
                <>
                    <NavbarComponent />
                    {children}
                    <Footer />
                </>
            );
        }
    }
}
