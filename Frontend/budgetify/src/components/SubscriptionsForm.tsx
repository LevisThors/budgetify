"use client";

import { CategoryType } from "@/type/CategoryType";
import { SubscriptionType } from "@/type/SubscriptionType";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import MESSAGE from "@/messages";
import revalidate from "@/util/revalidate";
import Input from "./partials/Input";
import MultiSelect from "./partials/MultiSelect";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { Dialog, DialogTrigger } from "./ui/dialog";
import DialogBody from "./partials/DialogBody";
import Button from "./partials/Button";
import { DateRangePicker } from "./partials/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface SubscriptionFormProps {
    type: string;
    subscription?: SubscriptionType;
    changeActiveType?: (type: string) => void;
}

const emptySubscription: SubscriptionType = {
    title: "",
    description: "",
    amount: 0,
    first_payment_date: new Date(),
    second_payment_date: undefined,
    categories: [],
};

export default function SubscriptionForm({
    type,
    subscription,
    changeActiveType,
}: SubscriptionFormProps) {
    switch (type) {
        case "view":
            return (
                subscription && (
                    <SubscriptionViewForm subscription={subscription} />
                )
            );
        case "edit":
            return (
                subscription && (
                    <SubscriptionCreateForm
                        type="edit"
                        subscription={subscription}
                        changeActiveType={changeActiveType}
                    />
                )
            );
        case "create":
            return <SubscriptionCreateForm type="create" />;
        default:
            return (
                subscription && (
                    <SubscriptionViewForm subscription={subscription} />
                )
            );
    }
}

function SubscriptionViewForm({
    subscription,
}: {
    subscription: SubscriptionType;
}) {
    const [isDocumentOpen, setIsDocumentOpen] = useState("");

    const handleOpenDocument = (path: string) => {
        setIsDocumentOpen(path);
    };

    const handleCloseDocument = () => {
        setIsDocumentOpen("");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <span className="text-3xl text-red-500">
                    {subscription.amount}$
                </span>
            </div>
            <div>
                <h1 className="text-2xl">{subscription.title}</h1>
            </div>
            <div className="flex gap-3">
                {subscription.categories.map((category) => (
                    <span
                        key={category.id}
                        className="px-9 py-3 border border-black rounded-lg font-bold"
                    >
                        {category.title}
                    </span>
                ))}
            </div>
            <div>
                <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                    <span className="w-1/3 font-bold">Payment Date:</span>
                    <span className="w-2/3">
                        {subscription.first_payment_date.toString()}{" "}
                        {subscription.second_payment_date &&
                            ` - ${subscription.second_payment_date.toString()}`}
                    </span>
                </div>
                {subscription.description && (
                    <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                        <span className="w-1/3 font-bold">Description:</span>
                        <span className="w-2/3">
                            {subscription.description}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function SubscriptionCreateForm({
    type,
    subscription,
    changeActiveType,
}: {
    type: string;
    subscription?: SubscriptionType;
    changeActiveType?: (type: string) => void;
}) {
    const [formData, setFormData] = useState(
        subscription ? subscription : emptySubscription
    );
    const [categories, setCategories] = useState<{
        [key: string]: CategoryType[];
    }>();
    const [refetch, setRefetch] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const closeRef = useRef<HTMLButtonElement>(null);
    const prevDateRef = useRef<DateRange | undefined>();
    const { toast } = useToast();

    useEffect(() => {
        fetch(
            `${PATHS.API.PROXY.CATEGORY.GET}?account_id=${localStorage.getItem(
                "activeAccount"
            )}`,
            {
                headers: {
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((data) => setCategories(data));
    }, [refetch]);

    const refetchCategories = () => {
        setRefetch((prev) => !prev);
    };

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
                    : undefined,
            }));
        }

        prevDateRef.current = date;
    };

    const handleSelect = (id: string, action: "add" | "delete") => {
        const category = categories?.["Expenses"].find(
            (category) => category.id == id
        );

        if (action === "add") {
            setFormData((prev) => ({
                ...prev,
                categories: [...prev.categories, category as CategoryType],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                categories: prev.categories.filter(
                    (category) => category.id != id
                ),
            }));
        }
    };

    const handleInactive = () => {
        setError(MESSAGE.ERROR.FILL_REQUIRED);
    };

    const isFormValid = () => {
        return (
            formData.title.trim() !== "" &&
            formData.amount !== null &&
            formData.first_payment_date.toString() !== "" &&
            formData.categories.length > 0
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

            formData.categories.forEach((category) => {
                data.append("categories[]", category?.id?.toString() || "");
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
                    ? PATHS.API.PROXY.SUBSCIRPTION.PUT(subscription?.id || "")
                    : PATHS.API.PROXY.SUBSCIRPTION.POST,
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
                    if (type === "edit") {
                        if (changeActiveType) changeActiveType("view");
                        toast({
                            description: MESSAGE.SUCCESS.UPDATE("Subscription"),
                        });
                    } else {
                        toast({
                            description:
                                MESSAGE.SUCCESS.CREATION("Subscription"),
                        });
                    }
                }
                if (res.status === 400) {
                    const { message } = await res.json();
                    if (message === "Insufficient funds") {
                        setError(MESSAGE.ERROR.INSUFFICIENT_FUNDS);
                    } else if (message === "Invalid date") {
                        setError(MESSAGE.ERROR.INVALID_DATE);
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
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required={true}
                    maxLength={128}
                />
                {categories && (
                    <MultiSelect
                        label="Categories"
                        categories={categories["Expenses"]}
                        refetch={refetchCategories}
                        selected={formData.categories}
                        onSelect={handleSelect}
                        required={true}
                    />
                )}
                <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount.toString()}
                    onChange={handleChange}
                    required={true}
                />
                <DateRangePicker
                    onDateChange={handleDateChange}
                    originalDate={{
                        from: formData.first_payment_date as Date,
                        to: formData.second_payment_date as Date | undefined,
                    }}
                />

                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <SheetClose ref={closeRef}></SheetClose>
            <SheetFooter className="flex gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <button>Cancel</button>
                    </DialogTrigger>
                    <DialogBody
                        header="Cancel Subscription"
                        body={MESSAGE.WARNING.CANCEL("subscription")}
                        onYes={() => closeRef.current?.click()}
                    />
                </Dialog>
                <Button
                    onClick={handleSubmit}
                    onInactiveClick={handleInactive}
                    text="Save"
                    className="text-red px-5"
                    active={isFormValid()}
                />
            </SheetFooter>
        </div>
    );
}
