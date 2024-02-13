"use client";

import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import { useRef, useState } from "react";
import Input from "./partials/Input";
import { useToast } from "./ui/use-toast";
import { SheetClose, SheetFooter } from "./ui/sheet";
import Button from "./partials/Button";
import { CategoryType } from "@/type/CategoryType";

export default function CategoryForm({
    type,
    refetch,
    category,
}: {
    type: string;
    refetch: () => void;
    category?: CategoryType;
}) {
    const [formData, setFormData] = useState(
        category
            ? {
                  type: category.type,
                  title: category.title,
              }
            : {
                  type: "Expenses",
                  title: "",
              }
    );
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
        return formData.title.trim() !== "";
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            await fetch(
                type === "add"
                    ? PATHS.API.PROXY.CATEGORY.POST
                    : PATHS.API.PROXY.CATEGORY.PUT(category?.id || ""),
                {
                    method: type === "add" ? "POST" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `laravel_session=${getCookie(
                            "laravel_session"
                        )}`,
                        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                        "ngrok-skip-browser-warning": "69420",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...formData,
                        account_id: localStorage.getItem("activeAccount"),
                    }),
                }
            ).then((res) => {
                if (res.status === 200) {
                    refetch();
                    closeRef?.current?.click();
                    toast({
                        description: "Category has been created successfully",
                    });
                }
                if (res.status === 400) {
                    setError("Category with such name already exists");
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
                    <div className="flex gap-2">
                        {["Expenses", "Income"].map((type) => (
                            <span
                                key={type}
                                className={`w-fit text-xl border border-authBlack p-2 rounded-lg cursor-pointer ${
                                    formData.type !== type ? "opacity-50" : ""
                                } `}
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        type: type as "Income" | "Expenses",
                                    })
                                }
                            >
                                {type}
                            </span>
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
