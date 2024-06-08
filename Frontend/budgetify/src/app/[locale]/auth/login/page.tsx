import Login from "@/components/Login";
import { Suspense } from "react";
import { getUserData } from "@/util/getUserData";
import { redirect } from "next/navigation";
import PATHS from "@/paths";
import { getTranslations } from "next-intl/server";

export default async function LoginPage({
    params,
}: {
    params: { locale: string };
}) {
    try {
        const userData = await getUserData();

        if (userData) redirect(`${params.locale}/${PATHS.PAGES().HOME}`);
    } catch (error) {}

    const t = await getTranslations("Auth");

    return (
        <section
            className="w-full h-full flex justify-center items-center bg-cover"
            style={{ backgroundImage: "url('/images/piggyWallpaper.svg')" }}
        >
            <Suspense>
                <Login errorMessage={t("invalid")} />
            </Suspense>
        </section>
    );
}
