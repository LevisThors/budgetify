import AdminLogin from "@/components/partials/AdminLogin";
import { Suspense } from "react";

export default function AdminPage() {
    return (
        <section
            className="w-full h-full flex justify-center items-center bg-cover"
            style={{ backgroundImage: "url('/images/piggyWallpaper.svg')" }}
        >
            <Suspense>
                <AdminLogin />
            </Suspense>
        </section>
    );
}
