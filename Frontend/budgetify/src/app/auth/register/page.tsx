import Registration from "@/components/Registration";
import { Suspense } from "react";
import { getUserData } from "@/components/partials/User";
import { redirect } from "next/navigation";
import PATHS from "@/paths";

export default async function RegistrationPage() {
    try {
        const userData = await getUserData();

        if (userData) redirect(PATHS.PAGES().HOME);
    } catch (error) {}

    return (
        <section
            className="w-full h-full flex justify-center items-center bg-cover"
            style={{ backgroundImage: "url('/images/piggyWallpaper.svg')" }}
        >
            <Suspense>
                <Registration />
            </Suspense>
        </section>
    );
}
