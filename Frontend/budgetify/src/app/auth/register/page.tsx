import Image from "next/image";
import Registration from "@/components/Registration";
import { Suspense } from "react";
import { getUserData } from "@/components/partials/User";
import { redirect } from "next/navigation";

export default async function RegistrationPage() {
    try {
        const userData = await getUserData();

        if (userData) redirect("/dashboard/account/transactions");
    } catch (error) {}

    return (
        <section className="w-full h-full flex justify-center items-center">
            <Image
                src="/images/piggyWallpaper.svg"
                alt="budgetify"
                height={100}
                width={100}
                className="w-full h-full absolute top-0 left-0 object-cover"
            />
            <Suspense>
                <Registration />
            </Suspense>
        </section>
    );
}
