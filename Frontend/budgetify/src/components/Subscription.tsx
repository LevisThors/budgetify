"use client";

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
import SubscriptionForm from "./SubscriptionsForm";
import Image from "next/image";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import { toast } from "./ui/use-toast";
import MESSAGE from "@/messages";
import { SubscriptionType } from "@/type/SubscriptionType";

export default function Subscription({
    subscription,
}: {
    subscription: SubscriptionType;
}) {
    const [activeType, setActiveType] = useState("view");
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleChangeActiveType = (type: string) => {
        setActiveType(type);
    };

    const handleDelete = async (id: string) => {
        fetch(PATHS.API.PROXY.SUBSCIRPTION.DELETE(id), {
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
                    description: MESSAGE.SUCCESS.DELETE("Subscription"),
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
                            ? "Subscription Information"
                            : "Edit Subscription"}
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
                                            alt="delete subscripton"
                                            width={36}
                                            height={36}
                                        />
                                    </DialogTrigger>
                                    <DialogBody
                                        header="Delete Subscription"
                                        body={MESSAGE.WARNING.DELETE(
                                            "subscription"
                                        )}
                                        onYes={() =>
                                            handleDelete(
                                                subscription.id?.toString() ||
                                                    ""
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
                <SubscriptionForm
                    type={activeType}
                    changeActiveType={handleChangeActiveType}
                    subscription={subscription}
                />
            </SheetContent>
        </Sheet>
    );
}
