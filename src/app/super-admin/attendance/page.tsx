"use client"
import GenderTable from "@vibrance/components/tables/genderTable"

export default function Page() {
    return <>
        <section className="grid grid-cols-8 py-4">
            <section className="col-start-2 col-span-5 w-full">
                <p className="font-extrabold text-4xl">
                    Attendance Data
                </p>

                <p className="font-semibold text-xl py-4">
                    Entry Data
                </p>
                <section className="">
                    <GenderTable/>
                </section>
            </section>
        </section>
    </>
}