import NavBar from "@/components/NavBar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header className="px-10">
                <NavBar />
            </header>
            <main className="px-10">{children}</main>
        </>
    );
}
