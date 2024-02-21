"use client";

import { TransactionType } from "@/type/TransactionType";
import { useRef, useState } from "react";
import {
    SheetTrigger,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetClose,
    SheetFooter,
} from "@/components/ui/sheet";
import { DialogTrigger, Dialog } from "./ui/dialog";
import DialogBody from "./partials/DialogBody";
import TransactionForm from "./TransactionForm";
import Image from "next/image";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import { toast } from "./ui/use-toast";
import MESSAGE from "@/messages";

export default function Transaction({
    transaction,
}: {
    transaction: TransactionType;
}) {
    const [activeType, setActiveType] = useState("view");
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleChangeActiveType = (type: string) => {
        setActiveType(type);
    };

    const handleDelete = async (id: string) => {
        fetch(PATHS.API.PROXY.TRANSACTION.DELETE(id), {
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
                    description: MESSAGE.SUCCESS.DELETE("Transaction"),
                    variant: "destructive",
                });
                closeRef?.current?.click();
            }
        });
    };

    return (
        <Sheet>
            <SheetTrigger>
                <div className="absolute w-full h-full top-0 left-0"></div>
            </SheetTrigger>
            <SheetClose ref={closeRef}></SheetClose>
            <SheetContent>
                <SheetHeader className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl">
                        {activeType === "view"
                            ? "Transaction Information"
                            : "Edit Transaction"}
                    </h1>
                    <div>
                        {activeType === "view" ? (
                            <>
                                <button onClick={() => setActiveType("edit")}>
                                    <Image
                                        src="/icons/edit.svg"
                                        alt="edit transaction"
                                        width={36}
                                        height={36}
                                    />
                                </button>

                                <Dialog>
                                    <DialogTrigger>
                                        <Image
                                            src="/icons/delete.svg"
                                            alt="delete transaction"
                                            width={36}
                                            height={36}
                                        />
                                    </DialogTrigger>
                                    <DialogBody
                                        header="Delete Transaction"
                                        body="Are you sure you want to delete transaction?"
                                        onYes={() =>
                                            handleDelete(
                                                transaction.id?.toString() || ""
                                            )
                                        }
                                    />
                                </Dialog>
                            </>
                        ) : null}
                        <SheetClose onClick={() => setActiveType("view")}>
                            <Image
                                src="/icons/close.svg"
                                alt="close"
                                width={35}
                                height={35}
                            />
                        </SheetClose>
                    </div>
                </SheetHeader>
                <TransactionForm
                    type={activeType}
                    changeActiveType={handleChangeActiveType}
                    transaction={transaction}
                />
            </SheetContent>
        </Sheet>
    );
}
