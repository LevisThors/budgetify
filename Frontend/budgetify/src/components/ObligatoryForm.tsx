"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import MESSAGE from "@/messages";
import revalidate from "@/util/revalidate";
import Input from "./partials/Input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Dialog, DialogTrigger } from "./ui/dialog";
import DialogBody from "./partials/DialogBody";
import Button from "./partials/Button";
import { DateRangePicker } from "./partials/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useLoading } from "@/context/Loading";
import { ObligatoryType } from "@/type/ObligatoryType";
import { useParams } from "next/navigation";

interface ObligatoryFormProps {
    type: string;
    obligatory?: ObligatoryType;
    changeActiveType?: (type: string) => void;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const emptyObligation: ObligatoryType = {
    title: "",
    description: "",
    amount: 0,
    first_payment_date: tomorrow,
    second_payment_date: new Date(tomorrow),
};

export default function ObligatoryForm({
    type,
    obligatory,
    changeActiveType,
}: ObligatoryFormProps) {
    const [inputFields, setInputFields] = useState<{
        [key: string]: string;
    }>({});
    const [obligatoryFields, setObligatoryFields] = useState<{
        [key: string]: string;
    }>({});
    const params = useParams();

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../messages/${params.locale}.json`
            );
            setObligatoryFields(messageData.Obligatory);
            setInputFields(messageData.Input);
        };

        getMessage();
    }, [params.locale]);

    switch (type) {
        case "view":
            return (
                obligatory && (
                    <ObligatoryViewForm
                        obligatory={obligatory}
                        t={{ ...inputFields, ...obligatoryFields }}
                    />
                )
            );
        case "edit":
            return (
                obligatory && (
                    <ObligatoryCreateForm
                        type="edit"
                        obligatory={obligatory}
                        changeActiveType={changeActiveType}
                        t={{ ...inputFields, ...obligatoryFields }}
                    />
                )
            );
        case "create":
            return (
                <ObligatoryCreateForm
                    type="create"
                    t={{ ...inputFields, ...obligatoryFields }}
                />
            );
        default:
            return (
                obligatory && (
                    <ObligatoryViewForm
                        obligatory={obligatory}
                        t={{ ...inputFields, ...obligatoryFields }}
                    />
                )
            );
    }
}

function ObligatoryViewForm({
    obligatory,
    t,
}: {
    obligatory: ObligatoryType;
    t: any;
}) {
    return (
        <div className="h-[95%] flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    {obligatory.amount > 0 ? (
                        <span className="text-3xl text-red-500">
                            {obligatory.amount}$
                        </span>
                    ) : (
                        ""
                    )}
                </div>
                <div>
                    <h1 className="text-2xl">{obligatory.title}</h1>
                </div>
                <div>
                    <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                        <span className="w-1/3 font-bold">
                            {t.paymentDates}:
                        </span>
                        <span className="w-2/3">
                            {obligatory.first_payment_date.toString()}{" "}
                            {obligatory.second_payment_date &&
                                ` - ${obligatory.second_payment_date.toString()}`}
                        </span>
                    </div>
                    {obligatory.description && (
                        <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                            <span className="w-1/3 font-bold">
                                {t.description}:
                            </span>
                            <span className="w-2/3">
                                {obligatory.description}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <SheetFooter>
                <SheetClose className="text-lg">{t.close}</SheetClose>
            </SheetFooter>
        </div>
    );
}

function ObligatoryCreateForm({
    type,
    obligatory,
    changeActiveType,
    t,
}: {
    type: string;
    obligatory?: ObligatoryType;
    changeActiveType?: (type: string) => void;
    t: any;
}) {
    const [formData, setFormData] = useState(
        obligatory ? obligatory : emptyObligation
    );
    const [error, setError] = useState<string>("");
    const closeRef = useRef<HTMLButtonElement>(null);
    const prevDateRef = useRef<DateRange | undefined>();
    const { loadingStates, setLoadingStates } = useLoading();

    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: DateRange | undefined) => {
        if (
            date?.from &&
            (!prevDateRef.current ||
                date.from !== prevDateRef.current.from ||
                date.to !== prevDateRef.current.to)
        ) {
            setFormData((prev) => ({
                ...prev,
                first_payment_date: format(
                    date.from || new Date(),
                    "yyyy-MM-dd"
                ),
                second_payment_date: date.to
                    ? format(date.to, "yyyy-MM-dd")
                    : new Date(),
            }));
        }

        prevDateRef.current = date;
    };

    const handleInactive = () => {
        setError(t.fillReq);
    };

    const isFormValid = () => {
        return (
            formData.title.trim() !== "" &&
            formData.first_payment_date.toString() !== "" &&
            formData.second_payment_date.toString() !== ""
        );
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "categories") {
                    if (value) data.append(key, value.toString());
                }
            });

            data.append(
                "account_id",
                localStorage.getItem("activeAccount") || ""
            );

            if (type === "edit") {
                data.append("_method", "PUT");
            }

            await fetch(
                type === "edit"
                    ? PATHS.API.PROXY.OBLIGATORY.PUT(obligatory?.id || "")
                    : PATHS.API.PROXY.OBLIGATORY.POST,
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
            ).then(async (res) => {
                if (res.status === 200) {
                    revalidate();
                    closeRef?.current?.click();
                    const item = await res.json();

                    if (type === "edit") {
                        if (changeActiveType) changeActiveType("view");
                        setLoadingStates({ ...loadingStates, [item.id]: true });
                        toast({
                            description: t.update,
                        });
                    } else {
                        toast({
                            description: t.create,
                        });
                    }
                }
                if (res.status === 400) {
                    const { message } = await res.json();
                    if (message === "Insufficient funds") {
                        setError(t.insFunds);
                    } else if (message === "Invalid date") {
                        setError(t.invalidDate);
                    }
                }
            });
        }
    };

    return (
        <div className="flex flex-col h-[95%] justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    {error && (
                        <div className="w-full p-2 bg-red-500 bg-opacity-50 text-authBlack flex justify-between text-sm rounded-md">
                            <span>{error}</span>
                            <button onClick={() => setError("")}>X</button>
                        </div>
                    )}
                </div>
                <Input
                    label={t.title}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required={true}
                    maxLength={128}
                />
                <Input
                    label={t.amount}
                    name="amount"
                    type="number"
                    value={formData.amount?.toString()}
                    onChange={handleChange}
                />
                <Input
                    label={t.frequency}
                    name="frequency"
                    type="select"
                    options={[t.monthly]}
                    value={t.monthly}
                />
                <DateRangePicker
                    onDateChange={handleDateChange}
                    originalDate={{
                        from: formData.first_payment_date as Date,
                        to: formData.second_payment_date as Date | undefined,
                    }}
                />
                <Input
                    label={t.description}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <SheetClose ref={closeRef}></SheetClose>
            <SheetFooter className="flex gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <button>{t.cancel}</button>
                    </DialogTrigger>
                    <DialogBody
                        header={t.cancelH}
                        body={t.cancelM}
                        onYes={() => closeRef.current?.click()}
                    />
                </Dialog>
                <Button
                    onClick={handleSubmit}
                    onInactiveClick={handleInactive}
                    text={t.save}
                    className="text-red px-5"
                    active={isFormValid()}
                />
            </SheetFooter>
        </div>
    );
}
