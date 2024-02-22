import Link from "next/link";
import User from "./partials/User";
import { headers } from "next/headers";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ActivePath from "./partials/ActivePath";

const Logo = dynamic(() => import("./partials/Logo"), { ssr: false });

export default function NavBar() {
    const headersList = headers();
    const accountId =
        headersList.get("referer")?.split("?")[0].split("/")[4] || "account";

    const navLinks = {
        Categories: `/dashboard/categories`,
        Subscriptions: `/dashboard/${accountId}/subscriptions`,
        Obligatory: `/dashboard/${accountId}/obligatory`,
        Statistic: `/dashboard/${accountId}/statistic`,
        Admin: `/dashboard/${accountId}/admin`,
    };

    return (
        <nav className="flex justify-between py-7 items-center">
            <Suspense fallback={<span>Budgetify</span>}>
                <Logo />
            </Suspense>
            <div>
                <ul className="flex gap-5 text-md">
                    {Object.entries(navLinks).map(([name, path]) => {
                        return (
                            <li key={name} className="p-1">
                                <Link href={path}>{name}</Link>
                                <Suspense>
                                    <ActivePath path={path} />
                                </Suspense>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div>
                <User />
            </div>
        </nav>
    );
}
