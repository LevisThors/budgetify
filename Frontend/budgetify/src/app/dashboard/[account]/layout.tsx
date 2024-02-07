import SideBar from "@/components/SideBar";
import { Suspense } from "react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex">
            <aside>
                <Suspense>
                    <SideBar />
                </Suspense>
            </aside>
            {children}
        </section>
    );
}
