"use client";

import { useState, useRef } from "react";
import { AccountType } from "@/type/AccountType";
import currencyToSymbol from "@/util/currencyToSymbol";
import Input from "./partials/Input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import Button from "./partials/Button";

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

function AccountEditForm({
    account,
    refetch,
}: {
    account: AccountType;
    refetch?: () => void;
}) {
    const [formData, setFormData] = useState<AccountType>(account);
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        fetch(`/backend/api/accounts/${account.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
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
                closeRef?.current?.click();
            }
        });
    };

    return (
        <div className="flex flex-col h-[95%] justify-between">
            <div className="flex flex-col gap-4">
                <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Currency"
                    name="currency"
                    type="select"
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
                />
            </SheetFooter>
        </div>
    );
}

export function AccountCreateForm({ refetch }: { refetch?: () => void }) {
    const [formData, setFormData] = useState<AccountType>(emptyAccount);
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        fetch(`/backend/api/accounts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
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
                console.log(res.json());
                revalidate();
                closeRef?.current?.click();
            }
        });
    };

    return (
        <div className="flex flex-col h-[95%] justify-between">
            <div className="flex flex-col gap-4">
                <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Balance"
                    name="balance"
                    value={formData.balance.toString()}
                    onChange={handleChange}
                    required={true}
                />
                <Input
                    label="Currency"
                    name="currency"
                    type="select"
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
                />
            </SheetFooter>
        </div>
    );
}
