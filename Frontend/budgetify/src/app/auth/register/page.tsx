import Image from "next/image";
import Registration from "@/components/Registration";
import { Suspense } from "react";

export default function RegistrationPage() {
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
