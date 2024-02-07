"use client";

import { AccountType } from "@/type/AccountType";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import AccountCard from "./partials/AccountCard";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideBar() {
    const [accountData, setAccountData] = useState<AccountType[]>([]);
    const [activeAccount, setActiveAccount] = useState<string | null>("");
    const pathName = usePathname();

    const handleClick = (id: string | number) => {
        localStorage.setItem("activeAccount", id.toString());
        setActiveAccount(id.toString());
    };

    useEffect(() => {
        const res = fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`,
            {
                headers: {
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (localStorage.getItem("activeAccount") === null) {
                    localStorage.setItem("activeAccount", data[0].id);
                }
                setAccountData(data);
            });

        setActiveAccount(localStorage.getItem("activeAccount"));
    }, []);

    return (
        <ul className="flex flex-col gap-7">
            {accountData.map((account: AccountType) => (
                <Sheet key={account.id}>
                    {activeAccount == account.id ? (
                        <>
                            <SheetTrigger>
                                <AccountCard
                                    account={account}
                                    handleClick={handleClick}
                                    activeAccount={activeAccount}
                                />
                            </SheetTrigger>
                            <SheetContent></SheetContent>
                        </>
                    ) : (
                        <Link
                            href={`/dashboard/${account.id}/${
                                pathName.split("/")[3]
                            }`}
                        >
                            <AccountCard
                                account={account}
                                handleClick={handleClick}
                                activeAccount={activeAccount}
                            />
                        </Link>
                    )}
                </Sheet>
            ))}
        </ul>
    );
}
