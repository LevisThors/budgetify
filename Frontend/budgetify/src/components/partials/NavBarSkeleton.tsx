import Link from "next/link";
import User from "./User";
import { headers } from "next/headers";
import { Suspense } from "react";
import ActivePath from "./ActivePath";

export default function NavBarSkeleton() {
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
            <Link href={"#"}>Budgetify</Link>
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
