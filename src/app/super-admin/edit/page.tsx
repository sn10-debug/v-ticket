"use client";
import EditTable from "@vibrance/components/tables/tickets";
import InputDatabaseTable from "@vibrance/components/HandleInputDatabaseTableView";

export default function Page() {
    return (
        <>
            <section className="grid grid-cols-10 gap-4 px-4">
                <section className="col-start-2 col-span-8 py-2">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Edit entries
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Edit entries in the database.
                    </p>
                    <section className="flex items-center justify-between w-full py-4">
                        <InputDatabaseTable />
                    </section>
                </section>
            </section>
        </>
    );
}
