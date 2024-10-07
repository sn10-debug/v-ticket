"use client";
import { SiReactos } from "react-icons/si";

export default function Loading() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center">
            <SiReactos className="text-6xl text-zinc-800 animate-spin" />
        </section>
    );
}
