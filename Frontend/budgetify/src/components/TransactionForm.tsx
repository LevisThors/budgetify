"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { TransactionType } from "@/type/TransactionType";
import { CategoryType } from "@/type/CategoryType";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import Input from "./partials/Input";
import { SheetFooter, SheetClose } from "./ui/sheet";
import Button from "./partials/Button";
import Dropzone from "./partials/Dropzone";
import MultiSelect from "./partials/MultiSelect";
import PATHS from "@/paths";
import Image from "next/image";
import {
    DialogTrigger,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogClose,
    DialogHeader,
} from "./ui/dialog";
import DocumentImage from "./partials/DocumentImage";
import ActionButton from "./partials/ActionButton";

const emptyTransaction = {
    type: "Expenses" as "Income" | "Expenses",
    title: "",
    categories: [] as CategoryType[],
    amount: 0,
    payment_date: "",
    payee: "",
    description: "",
    media: [] as File[] | undefined,
};

interface TransactionFormProps {
    type: string;
    transaction?: TransactionType;
    changeActiveType?: (type: string) => void;
}

export default function TransactionForm({
    type,
    transaction,
    changeActiveType,
}: TransactionFormProps) {
    switch (type) {
        case "view":
            return (
                transaction && <TransactionViewForm transaction={transaction} />
            );
        case "edit":
            return (
                transaction && (
                    <TransactionCreateForm
                        type="edit"
                        transaction={transaction}
                        changeActiveType={changeActiveType}
                    />
                )
            );
        case "create":
            return <TransactionCreateForm type="create" />;
    }
}

function TransactionViewForm({
    transaction,
}: {
    transaction: TransactionType;
}) {
    const [isDocumentOpen, setIsDocumentOpen] = useState(false);
    const handleCloseDocument = () => {
        setIsDocumentOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <span className="text-lg">{transaction.type}</span>
                <span
                    className={`text-3xl ${
                        transaction.type === "Expenses"
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    {transaction.type === "Expenses" ? "-" : ""}
                    {transaction.amount}$
                </span>
            </div>
            <div>
                <h1 className="text-2xl">{transaction.title}</h1>
            </div>
            <div className="flex gap-3">
                {transaction.categories.map((category) => (
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
                        {transaction.payment_date.toString()}
                    </span>
                </div>
                {transaction.payee && (
                    <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                        <span className="w-1/3 font-bold">Payee:</span>
                        <span className="w-2/3">{transaction.payee}</span>
                    </div>
                )}
                {transaction.description && (
                    <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                        <span className="w-1/3 font-bold">Description:</span>
                        <span className="w-2/3">{transaction.description}</span>
                    </div>
                )}
            </div>
            <div>
                {transaction.documents?.map(
                    (document: { path: string; name: string }) => (
                        <div key={document.path}>
                            <div
                                className="flex items-center justify-between w-full border-b py-1.5 border-authBlack last:border-none"
                                onClick={handleCloseDocument}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src="/icons/image.svg"
                                        alt="Uploaded image"
                                        width={70}
                                        height={60}
                                    />
                                    <span className="text-xs max-w-full overflow-ellipsis">
                                        {document.name}
                                    </span>
                                </div>
                                <div className="h-[50px]">
                                    <button className="bg-buttonTeal flex gap-2 rounded-lg items-center py-1.5 px-2.5">
                                        <span className="h-[35px] w-[35px] bg-white flex justify-center items-center rounded-full">
                                            <Image
                                                src="/icons/download.svg"
                                                width={15}
                                                height={17}
                                                alt="filter-button"
                                            />
                                        </span>
                                        Download
                                    </button>
                                </div>
                            </div>
                            {isDocumentOpen && (
                                <DocumentImage
                                    imagePath={document.path}
                                    closeDocument={handleCloseDocument}
                                />
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function TransactionCreateForm({
    type,
    transaction,
    changeActiveType,
}: {
    type: string;
    transaction?: TransactionType;
    changeActiveType?: (type: string) => void;
}) {
    const [formData, setFormData] = useState(
        transaction ? transaction : emptyTransaction
    );
    const [categories, setCategories] = useState<{
        [key: string]: CategoryType[];
    }>();
    const [error, setError] = useState<string>("");
    const closeRef = useRef<HTMLButtonElement>(null);
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
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (file: File | null) => {
        setFormData((prev) => {
            if (!file) return prev;
            const newMedia = [...(prev.media ?? []), file];

            return { ...prev, media: newMedia };
        });
    };

    const handleFileDelete = (index: number) => {
        setFormData((prev) => {
            const newMedia = prev.media?.filter((_, i) => i !== index);
            return { ...prev, media: newMedia };
        });
    };

    const handleSelect = (id: string, action: "add" | "delete") => {
        const category = categories?.[formData.type].find(
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

    const isFormValid = () => {
        return (
            formData.title.trim() !== "" &&
            formData.amount !== null &&
            formData.payment_date.toString() !== "" &&
            formData.categories.length > 0
        );
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "media" && key !== "categories") {
                    if (value) data.append(key, value.toString());
                }
            });

            formData.categories.forEach((category) => {
                data.append("categories[]", category?.id?.toString() || "");
            });

            formData.media?.forEach((file) => {
                data.append("media[]", file);
            });

            data.append(
                "account_id",
                localStorage.getItem("activeAccount") || ""
            );

            await fetch(
                type === "edit"
                    ? PATHS.API.PROXY.TRANSACTION.PUT(transaction?.id || "")
                    : PATHS.API.PROXY.TRANSACTION.POST,
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
                    }
                    toast({
                        description:
                            "Transaction has been created successfully",
                    });
                }
                if (res.status === 400) {
                    setError("Insufficient Funds");
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
                    <div className="flex gap-1 w-fit border border-authBlack rounded-lg">
                        {["Expenses", "Income"].map((type) => (
                            <div
                                key={type}
                                className={`w-fit text-xl flex gap-1.5 ${
                                    type === "Expenses" ? "border-r" : ""
                                } border-authBlack p-2 rounded-lg cursor-pointer ${
                                    formData.type !== type ? "opacity-50" : ""
                                } `}
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        type: type as "Income" | "Expenses",
                                    })
                                }
                            >
                                <span
                                    className={`h-[30px] w-[30px] flex justify-center items-center rounded-full ${
                                        type === "Income"
                                            ? "bg-[#21C206]"
                                            : "bg-[#EE3F19]"
                                    }`}
                                >
                                    <Image
                                        src="/icons/arrow.svg"
                                        width={15}
                                        height={17}
                                        alt="filter-button"
                                        className={
                                            type === "Expenses"
                                                ? "transform rotate-180"
                                                : ""
                                        }
                                    />
                                </span>
                                <span>{type}</span>
                            </div>
                        ))}
                    </div>
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
                        categories={categories[formData.type]}
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
                <Input
                    label="Payment Date"
                    name="payment_date"
                    type="date"
                    value={formData.payment_date.toString()}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Payee"
                    name="payee"
                    value={formData.payee}
                    onChange={handleChange}
                />
                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <Dropzone
                    onFileUpload={handleFileUpload}
                    onDelete={handleFileDelete}
                />
            </div>
            <SheetClose ref={closeRef}></SheetClose>
            <SheetFooter className="flex gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <button>Cancel</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="flex justify-between">
                                <span>This transaction will not be saved</span>
                                <div>
                                    <Image
                                        src="/icons/close.svg"
                                        width={35}
                                        height={35}
                                        alt="close popup"
                                    />
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <p>Are you sure you want to cancel?</p>
                        </div>
                        <DialogFooter className="flex justify-end items-center">
                            <DialogClose asChild>
                                <span onClick={() => closeRef.current?.click()}>
                                    Yes
                                </span>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button text="No" onClick={() => {}} />
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    onClick={handleSubmit}
                    text="Save"
                    className="text-red px-5"
                    active={isFormValid()}
                />
            </SheetFooter>
        </div>
    );
}
