"use client";

import Footer from "@vibrance/components/footer";
import { useSession } from "next-auth/react";
import Loading from "@vibrance/components/Loading";
import { useRouter } from "next/navigation";
import AdminHero from "@vibrance/components/AdminHero";

export default function Handler() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "unauthenticated") {
        router.push("/");
    }

    return (
        <>
            <AdminHero />
            <Footer />
        </>
    );
}
