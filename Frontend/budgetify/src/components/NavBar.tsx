import Link from "next/link";
import User from "./partials/User";
import PATHS from "@/paths";
import { headers } from "next/headers";

export default function NavBar() {
    const headersList = headers();
    const accountId = headersList.get("referer")?.split("/")[4] || "account";

    const navLinks = {
        Categories: `/dashboard/categories`,
        Subscriptions: `/dashboard/${accountId}/subscriptions`,
        Obligatory: `/dashboard/${accountId}/obligatory`,
        Statistic: `/dashboard/${accountId}/statistic`,
        Admin: `/dashboard/${accountId}/admin`,
    };

    return (
        <nav className="flex justify-between py-7 items-center">
            <div>
                <Link href={PATHS.PAGES(accountId).HOME}>Budgetify</Link>
            </div>
            <div>
                <ul className="flex gap-5 text-md">
                    {Object.entries(navLinks).map(([name, path]) => {
                        return (
                            <li
                                key={name}
                                className="py-1 px-1 border-b border-b-transparent hover:border-b-black"
                            >
                                <Link href={path}>{name}</Link>
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
