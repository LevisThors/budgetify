"use client";

import { TransactionType } from "@/type/TransactionType";
import { useState } from "react";
import {
    SheetTrigger,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetClose,
} from "@/components/ui/sheet";
import TransactionForm from "./TransactionForm";
import Image from "next/image";

export default function Transaction({
    transaction,
}: {
    transaction: TransactionType;
}) {
    const [activeType, setActiveType] = useState("view");

    const handleChangeActiveType = (type: string) => {
        setActiveType(type);
    };

    const handleDelete = async () => {};

    return (
        <Sheet>
            <SheetTrigger>
                <div className="absolute w-full h-full top-0 left-0"></div>
            </SheetTrigger>
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
                                        onClick={handleDelete}
                                    />
                                </button>
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
