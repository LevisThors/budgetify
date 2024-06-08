"use client";

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetClose,
} from "./ui/sheet";
import AccountCard from "./partials/AccountCard";
import Link from "next/link";
import AccountForm from "./AccountForm";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AccountType } from "@/type/AccountType";
import { getCookie } from "cookies-next";
import { useToast } from "./ui/use-toast";
import revalidate from "@/util/revalidate";
import PATHS from "@/paths";
import { DialogTrigger, Dialog } from "./ui/dialog";
import DialogBody from "./partials/DialogBody";
import MESSAGE from "@/messages";

export default function Account({ account }: { account: AccountType }) {
    const [activeAccount, setActiveAccount] = useState<string | null>("");
    const [openAccountType, setOpenAccountType] = useState<string>("view");
    const { toast } = useToast();
    const closeRef = useRef<HTMLButtonElement>(null);
    const pathName = usePathname();

    const handleClick = (id: string | number, currency: string) => {
        localStorage.setItem("activeAccount", id.toString());
        setActiveAccount(id.toString());
    };

    const handleDelete = (id: string | number) => {
        localStorage.removeItem("activeAccount");
        setActiveAccount("");

        fetch(PATHS.API.PROXY.ACCOUNT.DELETE(id), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                revalidate();
                toast({
                    description: "Account has been deleted",
                    variant: "destructive",
                });
                closeRef?.current?.click();
            }
        });
    };

    const changeActiveAccountType = (type: string) => {
        setOpenAccountType(type);
    };

    useEffect(() => {
        setActiveAccount(localStorage.getItem("activeAccount"));
    }, [activeAccount]);

    return (
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
                                                setOpenAccountType("edit")
                                            }
                                        >
                                            <Image
                                                src="/icons/edit.svg"
                                                alt="edit account"
                                                width={36}
                                                height={36}
                                            />
                                        </button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button>
                                                    <Image
                                                        src="/icons/delete.svg"
                                                        alt="delete account"
                                                        width={32}
                                                        height={32}
                                                    />
                                                </button>
                                            </DialogTrigger>
                                            <DialogBody
                                                header="Delete Account"
                                                body={MESSAGE.WARNING.DELETE(
                                                    "Account"
                                                )}
                                                onYes={() =>
                                                    handleDelete(
                                                        account.id || ""
                                                    )
                                                }
                                            />
                                        </Dialog>
                                    </>
                                ) : null}
                                <SheetClose
                                    onClick={() => setOpenAccountType("view")}
                                    ref={closeRef}
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
                            type={openAccountType === "view" ? "view" : "edit"}
                            changeType={changeActiveAccountType}
                            account={account}
                        />
                    </SheetContent>
                </>
            ) : (
                <Link
                    href={`/dashboard/${account.id}/${pathName.split("/")[3]}`}
                >
                    <AccountCard
                        account={account}
                        handleClick={handleClick}
                        activeAccount={activeAccount}
                    />
                </Link>
            )}
        </Sheet>
    );
}
