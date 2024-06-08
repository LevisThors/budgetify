"use client";

import Link from "next/link";
import User from "./partials/User";
import { Suspense, useEffect, useState } from "react";
import ActivePath from "./partials/ActivePath";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Logo = dynamic(() => import("./partials/Logo"), { ssr: false });

export default function NavBar() {
    const accountId = localStorage.getItem("activeAccount") || "account";

    const params = useParams();

    const enLinks = {
        Categories: `/${params.locale}/dashboard/categories`,
        Subscriptions: `/${params.locale}/dashboard/${accountId}/subscriptions`,
        Obligatory: `/${params.locale}/dashboard/${accountId}/obligatory`,
        Statistic: `/${params.locale}/dashboard/${accountId}/statistic`,
        Admin: `/${params.locale}/dashboard/${accountId}/admin`,
    };

    const kaLinks = {
        კატეგორიები: `/${params.locale}/dashboard/categories`,
        გამოწერები: `/${params.locale}/dashboard/${accountId}/subscriptions`,
        ვალდებულებები: `/${params.locale}/dashboard/${accountId}/obligatory`,
        სტატისტიკა: `/${params.locale}/dashboard/${accountId}/statistic`,
        ადმინი: `/${params.locale}/dashboard/${accountId}/admin`,
    };

    const navLinks = params.locale === "en" ? enLinks : kaLinks;

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
