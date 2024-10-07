"use client";

import DatabaseTable from "@vibrance/components/DatabaseTableView";
import Footer from "@vibrance/components/footer";

export default function Page() {
    return (
        <section className="min-h-screen">
            <DatabaseTable />
            <Footer />
        </section>
    );
}
