"use client";

import { useState, useContext, useRef } from "react";
import { AccountType } from "@/type/AccountType";
import currencyToSymbol from "@/util/currencyToSymbol";
import Input from "./partials/Input";
import { SheetClose, SheetFooter } from "./ui/sheet";
import { getCookie } from "cookies-next";

interface AccountFormProps {
    type: "view" | "edit" | "create";
    account?: AccountType;
    refetch?: () => void;
}

const displayFields = ["Title", "Balance", "Currency", "Description"];
const emptyAccount = {
    title: "",
    balance: "",
    currency: "USD",
    description: "",
};

export default function AccountForm({
    type,
    account,
    refetch,
}: AccountFormProps) {
    switch (type) {
        case "view":
            return (
                <AccountViewForm account={account ? account : emptyAccount} />
            );

        case "edit":
            return (
                <AccountEditForm
                    account={account ? account : emptyAccount}
                    refetch={refetch}
                />
            );

        case "create":
            return <AccountCreateForm refetch={refetch} />;
    }
}

function AccountViewForm({ account }: { account: AccountType }) {
    return (
        <div>
            {displayFields.map((field) => (
                <div
                    key={field}
                    className="w-full flex py-2 border-b border-b-authBlack last:border-none text-lg"
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
                if (refetch) refetch();
                closeRef?.current?.click();
            }
        });
    };

    return (
        <>
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
            <SheetFooter>
                <SheetClose ref={closeRef}>Cancel</SheetClose>
                <button
                    type="submit"
                    className="bg-authGreen w-full py-2 rounded-md"
                    onClick={handleSubmit}
                >
                    Save
                </button>
            </SheetFooter>
        </>
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
                if (refetch) refetch();
                closeRef?.current?.click();
            }
        });
    };

    return (
        <>
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
            <SheetFooter>
                <SheetClose ref={closeRef}>Cancel</SheetClose>
                <button
                    type="submit"
                    className="bg-authGreen w-full py-2 rounded-md"
                    onClick={handleSubmit}
                >
                    Save
                </button>
            </SheetFooter>
        </>
    );
}
