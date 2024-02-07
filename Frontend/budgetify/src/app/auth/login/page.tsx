import Image from "next/image";
import Login from "@/components/Login";
import { Suspense } from "react";
import { getUserData } from "@/components/partials/User";
import { redirect } from "next/navigation";

export default async function LoginPage() {
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
                <Login />
            </Suspense>
        </section>
    );
}
