import NavBarSkeleton from "@/components/partials/NavBarSkeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const NavBar = dynamic(() => import("@/components/NavBar"), {
    ssr: false,
    loading: () => <NavBarSkeleton />,
});

export default function DashboardLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: {
        locale: string;
    };
}>) {
    return (
        <>
            <header className="px-10">
                <Suspense>
                    <NavBar />
                </Suspense>
            </header>
            <main className="px-10">{children}</main>
        </>
    );
}
