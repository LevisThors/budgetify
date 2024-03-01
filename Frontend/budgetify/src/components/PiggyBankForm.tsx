"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, useToast } from "./ui/use-toast";
import { PiggyBankType } from "@/type/PiggyBankType";
import Button from "./partials/Button";
import Input from "./partials/Input";
import { SheetClose, SheetFooter, SheetHeader } from "./ui/sheet";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import currencyToSymbol from "@/util/currencyToSymbol";
import { Progress } from "./ui/progress";
import Image from "next/image";
import MESSAGE from "@/messages";
import { DatePicker } from "./partials/DatePicker";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "./ui/dialog";
import DialogBody from "./partials/DialogBody";
import { Sheet } from "lucide-react";

const emptyPiggyBank = {
    goal: "",
    goal_amount: "",
    saved_amount: "",
    date: "",
};

export default function PiggyBankForm({
    type,
    piggyBank,
}: {
    type?: string;
    piggyBank?: PiggyBankType;
}) {
    const [activeType, setActiveType] = useState(type);

    const handleChangeType = (type: string) => {
        setActiveType(type);
    };

    switch (activeType) {
        case "add":
            return <PiggyBankAdd type="add" />;
        case "edit":
            return (
                <PiggyBankAdd
                    type="edit"
                    piggyBank={piggyBank}
                    changeActiveType={handleChangeType}
                />
            );
        case "view":
            if (piggyBank)
                return (
                    <PiggyBankView
                        piggyBank={piggyBank}
                        onTypeChange={handleChangeType}
                    />
                );
        case "addMoney":
            if (piggyBank) return <PiggyBankAddMoney piggyBank={piggyBank} />;
        default:
            if (piggyBank)
                return (
                    <PiggyBankView
                        piggyBank={piggyBank}
                        onTypeChange={handleChangeType}
                    />
                );
    }
}

function PiggyBankAdd({
    type,
    piggyBank,
    changeActiveType,
}: {
    type: string;
    piggyBank?: PiggyBankType;
    changeActiveType?: (type: string) => void;
}) {
    const [formData, setFormData] = useState(piggyBank || emptyPiggyBank);
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null);
    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.goal.trim() !== "" && formData.goal_amount != 0;
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value.toString());
            });

            data.append(
                "account_id",
                localStorage.getItem("activeAccount") || ""
            );

            if (type === "edit") {
                data.append("_method", "PUT");
            }

            const response = await fetch(
                type === "edit"
                    ? PATHS.API.PROXY.PIGGY_BANK.PUT(piggyBank?.id || "")
                    : PATHS.API.PROXY.PIGGY_BANK.POST,
                {
                    method: "POST",
                    headers: {
                        Cookie: `laravel_session=${getCookie(
                            "laravel_session"
                        )}`,
                        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                        "ngrok-skip-browser-warning": "69420",
                    },
                    credentials: "include",
                    body: data,
                }
            ).then((res) => {
                if (res.status === 200) {
                    revalidate();
                    closeRef?.current?.click();
                    if (type === "edit") {
                        if (changeActiveType) changeActiveType("view");
                        toast({
                            description: MESSAGE.SUCCESS.UPDATE("Piggy Bank"),
                        });
                    } else {
                        toast({
                            description: MESSAGE.SUCCESS.CREATION("Piggy Bank"),
                        });
                    }
                }
                if (res.status === 400) {
                    setError(MESSAGE.ERROR.INSUFFICIENT_FUNDS);
                }
            });
        }
    };

    return (
        <>
            <SheetHeader className="flex flex-row justify-between items-center">
                <h1 className="text-2xl">{MESSAGE.BUTTON.ADD("Piggy Bank")}</h1>
                <div>
                    <SheetClose>
                        <Image
                            src="/icons/close.svg"
                            alt="close"
                            width={35}
                            height={35}
                        />
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="flex flex-col h-[95%] justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        {error && (
                            <div className="w-full p-2 bg-red-500 bg-opacity-50 text-authBlack flex justify-between text-sm rounded-md">
                                <span>{error}</span>
                                <button onClick={() => setError("")}>X</button>
                            </div>
                        )}
                        <Input
                            label="Goal"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            required={true}
                            maxLength={128}
                        />
                    </div>
                    <Input
                        label="Goal Amount"
                        name="goal_amount"
                        type="number"
                        value={formData.goal_amount.toString()}
                        onChange={handleChange}
                        required={true}
                    />
                </div>
                <SheetFooter className="flex gap-4">
                    <SheetClose ref={closeRef}>Cancel</SheetClose>
                    <Button
                        onClick={handleSubmit}
                        text="Save"
                        className="text-red px-5"
                        active={isFormValid()}
                    />
                </SheetFooter>
            </div>
        </>
    );
}

function PiggyBankView({
    piggyBank,
    onTypeChange,
}: {
    piggyBank: PiggyBankType;
    onTypeChange: (type: string) => void;
}) {
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleCrash = async () => {
        await fetch(PATHS.API.PROXY.PIGGY_BANK.CRASH(piggyBank.id || ""), {
            method: "POST",
            headers: {
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
                "Content-Type": "application/json",
            },
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                revalidate();
                closeRef?.current?.click();
                toast({
                    description: MESSAGE.SUCCESS.CRASH("Piggy Bank"),
                });
            }
        });
    };

    const handleDelete = async (id: string) => {
        fetch(PATHS.API.PROXY.PIGGY_BANK.DELETE(id), {
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
                    description: MESSAGE.SUCCESS.DELETE("Piggy Bank"),
                    variant: "destructive",
                });
                closeRef?.current?.click();
            }
        });
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <SheetHeader className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl">
                        {MESSAGE.HEADER.INFORMATION("Piggy Bank")}
                    </h1>
                    <div>
                        <button onClick={() => onTypeChange("edit")}>
                            <Image
                                src="/icons/edit.svg"
                                alt="edit account"
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
                                header="Delete Piggy Bank"
                                body={MESSAGE.WARNING.DELETE("piggy bank")}
                                onYes={() =>
                                    handleDelete(piggyBank.id?.toString() || "")
                                }
                            />
                        </Dialog>
                        <SheetClose ref={closeRef}>
                            <Image
                                src="/icons/close.svg"
                                alt="close"
                                width={35}
                                height={35}
                            />
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-between gap-1">
                        <span className="text-lg">
                            {piggyBank.saved_amount} / {piggyBank.goal_amount}{" "}
                            {currencyToSymbol(piggyBank.currency || "")}
                        </span>
                        <Progress
                            value={
                                (piggyBank.saved_amount /
                                    piggyBank.goal_amount) *
                                100
                            }
                            className="h-3 bg-[#FECEE2]"
                        />
                    </div>
                    <div>
                        <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                            <span className="w-1/3 font-bold">Goal:</span>
                            <span className="w-2/3">{piggyBank.goal}</span>
                        </div>
                        <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                            <span className="w-1/3 font-bold">
                                Goal Amount:
                            </span>
                            <span className="w-2/3">
                                {piggyBank.goal_amount}{" "}
                                {currencyToSymbol(piggyBank.currency || "")}
                            </span>
                        </div>
                        <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                            <span className="w-1/3 font-bold">
                                Saved Amount:
                            </span>
                            <span className="w-2/3">
                                {piggyBank.saved_amount}{" "}
                                {currencyToSymbol(piggyBank.currency || "")}
                            </span>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center gap-1 bg-[#FECEE2] rounded-lg text-[#373737] font-bold w-fit px-2 py-1">
                                <span className="w-[35px] h-[35px] flex justify-center items-center bg-white rounded-full">
                                    <Image
                                        src="/icons/piggyBank.svg"
                                        width={35}
                                        height={35}
                                        alt="Piggy Bank"
                                        loading="eager"
                                    />
                                </span>
                                <span className="pr-3">Crash</span>
                            </div>
                        </DialogTrigger>
                        <DialogBody
                            header="Delete Account"
                            body={MESSAGE.WARNING.DELETE("Account")}
                            onYes={() => handleCrash()}
                        />
                    </Dialog>
                </div>
            </div>
            <SheetFooter>
                <SheetClose className="text-lg">Close</SheetClose>
            </SheetFooter>
        </div>
    );
}

function PiggyBankAddMoney({ piggyBank }: { piggyBank: PiggyBankType }) {
    const [formData, setFormData] = useState<{
        amountToSave: number;
        date: Date | string | undefined;
    }>({
        amountToSave: 0,
        date: undefined,
    });
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null);
    const prevDateRef = useRef<Date | undefined>();

    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date && (!prevDateRef.current || date !== prevDateRef.current)) {
            setFormData((prev) => ({
                ...prev,
                date: format(date || new Date(), "yyyy-MM-dd"),
            }));
        }

        prevDateRef.current = date;
    };

    const isFormValid = () => {
        return formData.amountToSave !== 0 && formData.date !== "";
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            await fetch(PATHS.API.PROXY.PIGGY_BANK.PUT(piggyBank.id || ""), {
                method: "PUT",
                headers: {
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    amountToSave: formData.amountToSave,
                }),
            }).then((res) => {
                if (res.status === 200) {
                    revalidate();
                    closeRef?.current?.click();
                    toast({
                        description: MESSAGE.SUCCESS.UPDATE("Piggy Bank"),
                    });
                }
                if (res.status === 400) {
                    setError(MESSAGE.ERROR.INSUFFICIENT_FUNDS);
                }
            });
        }
    };

    return (
        <>
            <SheetHeader className="flex flex-row justify-between items-center">
                <h1 className="text-2xl">{MESSAGE.BUTTON.ADD("Piggy Bank")}</h1>
                <div>
                    <SheetClose>
                        <Image
                            src="/icons/close.svg"
                            alt="close"
                            width={35}
                            height={35}
                        />
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="flex flex-col h-[95%] justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        {error && (
                            <div className="w-full p-2 bg-red-500 bg-opacity-50 text-authBlack flex justify-between text-sm rounded-md">
                                <span>{error}</span>
                                <button onClick={() => setError("")}>X</button>
                            </div>
                        )}
                        <Input
                            label="Goal"
                            name="goal"
                            value={piggyBank.goal}
                            disabled={true}
                            maxLength={128}
                        />
                    </div>
                    <Input
                        label="Goal Amount"
                        name="goal_amount"
                        type="number"
                        disabled={true}
                        value={piggyBank.goal_amount.toString()}
                    />
                    <Input
                        label="Amount to save"
                        name="amountToSave"
                        type="number"
                        value={formData.amountToSave.toString()}
                        onChange={handleChange}
                        required={true}
                    />
                    <DatePicker
                        onDateChange={handleDateChange}
                        originalDate={formData.date as Date}
                    />
                </div>
                <SheetFooter className="flex gap-4">
                    <SheetClose ref={closeRef}>Cancel</SheetClose>
                    <Button
                        onClick={handleSubmit}
                        text="Save"
                        className="text-red px-5"
                        active={isFormValid()}
                    />
                </SheetFooter>
            </div>
        </>
    );
}
