"use client";

import { AccountType } from "@/type/AccountType";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetClose,
} from "./ui/sheet";
import AccountCard from "./partials/AccountCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AccountForm from "./AccountForm";
import Image from "next/image";

export default function SideBar() {
    const [accountData, setAccountData] = useState<AccountType[]>([]);
    const [activeAccount, setActiveAccount] = useState<string | null>("");
    const [openAccountType, setOpenAccountType] = useState<string>("view");
    const [refetch, setRefetch] = useState<boolean>(false);
    const pathName = usePathname();

    const handleClick = (id: string | number) => {
        localStorage.setItem("activeAccount", id.toString());
        setActiveAccount(id.toString());
    };

    useEffect(() => {
        const res = fetch(`/backend/api/accounts`, {
            headers: {
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (localStorage.getItem("activeAccount") === null) {
                    localStorage.setItem("activeAccount", data[0].id);
                }
                setAccountData(data);
            });

        setActiveAccount(localStorage.getItem("activeAccount"));
    }, [refetch]);

    const refetchData = () => {
        setRefetch((prev) => !prev);
    };

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
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        {openAccountType === "view"
                                            ? "Account Information"
                                            : "Edit Account"}
                                    </h1>
                                    <div>
                                        {openAccountType === "view" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setOpenAccountType(
                                                            "edit"
                                                        )
                                                    }
                                                >
                                                    <Image
                                                        src="/icons/edit.svg"
                                                        alt="edit account"
                                                        width={36}
                                                        height={36}
                                                    />
                                                </button>
                                                <button>
                                                    <Image
                                                        src="/icons/delete.svg"
                                                        alt="delete account"
                                                        width={32}
                                                        height={32}
                                                    />
                                                </button>
                                            </>
                                        ) : null}
                                        <SheetClose
                                            onClick={() =>
                                                setOpenAccountType("view")
                                            }
                                        >
                                            <Image
                                                src="/icons/close.svg"
                                                alt="close"
                                                width={35}
                                                height={35}
                                            />
                                        </SheetClose>
                                    </div>
                                </SheetHeader>
                                <AccountForm
                                    type={
                                        openAccountType === "view"
                                            ? "view"
                                            : "edit"
                                    }
                                    account={account}
                                    refetch={refetchData}
                                />
                            </SheetContent>
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
