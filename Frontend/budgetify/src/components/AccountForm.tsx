"use client";

import { useState, useRef } from "react";
import { AccountType } from "@/type/AccountType";
import currencyToSymbol from "@/util/currencyToSymbol";
import Input from "./partials/Input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import Button from "./partials/Button";
import { useToast } from "./ui/use-toast";
import PATHS from "@/paths";

interface AccountFormProps {
    type: "view" | "edit" | "create";
    account?: AccountType;
}

const displayFields = ["Title", "Balance", "Currency", "Description"];
const emptyAccount = {
    title: "",
    balance: "",
    currency: "USD",
    description: "",
};

export default function AccountForm({ type, account }: AccountFormProps) {
    switch (type) {
        case "view":
            return (
                <AccountViewForm account={account ? account : emptyAccount} />
            );

        case "edit":
            return (
                <AccountEditForm account={account ? account : emptyAccount} />
            );

        case "create":
            return <AccountCreateForm />;
    }
}

function AccountViewForm({ account }: { account: AccountType }) {
    return (
        <div>
            {displayFields.map((field) => (
                <div
                    key={field}
                    className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg"
                >
                    <span className="w-1/3 font-bold">{field}:</span>
                    <span className="w-2/3">
                        {account[field.toLowerCase()]}{" "}
                        {field.toLowerCase() === "balance"
                            ? currencyToSymbol(account.currency)
                            : field.toLowerCase() === "currency" &&
                              `(${currencyToSymbol(account.currency)})`}
                    </span>
                </div>
            ))}
        </div>
    );
}

function AccountEditForm({ account }: { account: AccountType }) {
    const [formData, setFormData] = useState<AccountType>(account);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [error, setError] = useState<string>("");
    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.title.trim() !== "" && formData.currency.trim() !== "";
    };

    const handleSubmit = () => {
        fetch(PATHS.API.PROXY.ACCOUNT.PUT(account.id || ""), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
            body: JSON.stringify({
                title: formData.title,
                currency: formData.currency,
                description: formData.description,
            }),
        }).then((res) => {
            if (res.status === 200) {
                revalidate(`/dashboard/${account.id}/transactions`);
                toast({
                    description: "Account has been updated successfully",
                });
                closeRef?.current?.click();
            }
            if (res.status === 400) {
                setError("Account with such title already exists");
            }
        });
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
                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required={true}
                    />
                </div>
                <Input
                    label="Currency"
                    name="currency"
                    type="select"
                    options={["USD", "EUR"]}
                    value={formData.currency}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <SheetFooter className="flex gap-4">
                <SheetClose ref={closeRef}>Cancel</SheetClose>
                <Button
                    onClick={handleSubmit}
                    text="Save"
                    active={isFormValid()}
                    className="text-red px-5"
                />
            </SheetFooter>
        </div>
    );
}

export function AccountCreateForm() {
    const [formData, setFormData] = useState<AccountType>(emptyAccount);
    const [error, setError] = useState<string>("");
    const closeRef = useRef<HTMLButtonElement>(null);
    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.title.trim() !== "" && formData.currency.trim() !== "";
    };

    const handleSubmit = async () => {
        await fetch(PATHS.API.PROXY.ACCOUNT.GET, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
            body: JSON.stringify({
                title: formData.title,
                balance: formData.balance,
                currency: formData.currency,
                description: formData.description,
            }),
        }).then((res) => {
            if (res.status === 200) {
                revalidate();
                closeRef?.current?.click();
                toast({
                    description: "Account has been created successfully",
                });
            }
            if (res.status === 400) {
                setError("Account with such title already exists");
            }
        });
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
                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required={true}
                        maxLength={128}
                    />
                </div>
                <Input
                    label="Balance"
                    name="balance"
                    type="number"
                    value={formData.balance.toString()}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Currency"
                    name="currency"
                    type="select"
                    options={["USD", "EUR"]}
                    defaultOption="CNY"
                    value={formData.currency}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
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
    );
}
