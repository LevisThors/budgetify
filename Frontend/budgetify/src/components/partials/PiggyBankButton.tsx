"use client";

import { PiggyBankType } from "@/type/PiggyBankType";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import PiggyBankForm from "../PiggyBankForm";
import currencyToSymbol from "@/util/currencyToSymbol";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PiggyBankButton({
    piggyBank,
}: {
    piggyBank?: PiggyBankType;
}) {
    const [piggyBankMessages, setPiggyBankMessages] = useState<{
        [key: string]: string;
    }>({});
    const params = useParams();

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setPiggyBankMessages(messageData.PiggyBank);
        };

        getMessage();
    }, [params.locale]);

    return (
        <div
            className={`${
                piggyBank ? "bg-[#FECEE2]" : "bg-buttonTeal"
            } text-authBlack py-1 px-4 rounded-lg flex items-center gap-2 relative w-full`}
        >
            <div className="w-[35px] h-[35px] flex justify-center items-center bg-white rounded-full">
                <Image
                    src="/icons/piggyBank.svg"
                    width={35}
                    height={35}
                    alt="Piggy Bank"
                    loading="eager"
                />
            </div>
            {piggyBank ? (
                <>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between gap-1">
                            <div className="flex flex-col text-start">
                                <span className="font-medium">
                                    {piggyBank.goal}
                                </span>
                                <span className="text-sm">
                                    {piggyBank.saved_amount >
                                    piggyBank.goal_amount
                                        ? piggyBank.saved_amount
                                        : piggyBank.saved_amount +
                                          " / " +
                                          piggyBank.goal_amount}
                                    {currencyToSymbol(piggyBank.currency || "")}
                                </span>
                            </div>
                            <div className="flex justify-center items-center relative">
                                <span className="flex w-[35px] h-[35px] bg-white text-[#FF76AE] rounded-full items-center justify-center text-4xl">
                                    +
                                </span>
                                <Sheet>
                                    <SheetTrigger>
                                        <div className="absolute top-0 left-0 w-full h-full z-20"></div>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <PiggyBankForm
                                            type="addMoney"
                                            piggyBank={piggyBank}
                                        />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                        <div className="w-full">
                            <Progress
                                value={
                                    piggyBank.saved_amount >
                                    piggyBank.goal_amount
                                        ? 100
                                        : (piggyBank.saved_amount /
                                              piggyBank.goal_amount) *
                                          100
                                }
                                className="w-full h-2"
                            />
                        </div>
                    </div>
                    <Sheet>
                        <SheetTrigger>
                            <div className="absolute top-0 left-0 w-full h-full z-10"></div>
                        </SheetTrigger>
                        <SheetContent>
                            <PiggyBankForm type="view" piggyBank={piggyBank} />
                        </SheetContent>
                    </Sheet>
                </>
            ) : (
                <>
                    <div className="bg-buttonTeal text-authBlack py-1 rounded-lg flex items-center">
                        <span className="font-medium text-start">
                            {piggyBankMessages.add}
                        </span>
                    </div>
                    <Sheet>
                        <SheetTrigger>
                            <div className="absolute top-0 left-0 w-full h-full z-10"></div>
                        </SheetTrigger>
                        <SheetContent>
                            <PiggyBankForm type="add" />
                        </SheetContent>
                    </Sheet>
                </>
            )}
        </div>
    );
}
