"use client";
import AnalyticsHero from "@vibrance/components/AnalyticsHero";
import Footer from "@vibrance/components/footer";
import { useSession } from "next-auth/react";

export default function Handler() {
    return (
        <>
            <AnalyticsHero />
            <Footer />
        </>
    );
}
