"use client";

import { CategoryType } from "@/type/CategoryType";
import { useState, useEffect } from "react";
import DataSlider from "./DataSlider";
import Image from "next/image";
import ActionButton from "./ActionButton";
import Input from "./Input";
import Button from "./Button";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import revalidate from "@/util/revalidate";
import MESSAGE from "@/messages";

interface MultiSelectProps {
    label: string;
    required?: boolean;
    categories: CategoryType[];
    refetch: () => void;
    onSelect: (id: string, action: "add" | "delete") => void;
    selected?: CategoryType[];
    type?: string;
}
export default function MultiSelect({
    label,
    required,
    categories,
    refetch,
    onSelect,
    selected,
    type = "Expenses",
}: MultiSelectProps) {
    const [newData, setNewData] = useState<CategoryType[]>(categories);
    const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
    const [touched, setTouched] = useState<boolean>(false);
    const [isCategoryInput, setIsCategoryInput] = useState(false);
    const [category, setCategory] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setNewData(
            categories.filter(
                (category) =>
                    !selected?.some(
                        (selectedCategory) =>
                            selectedCategory.id === category.id
                    )
            )
        );
    }, [categories, selected]);

    const handleOpenInput = () => {
        setIsCategoryInput((prev) => !prev);
    };

    const handleRemove = (id: string, event: any) => {
        event?.stopPropagation();
        setNewData((prev) => [
            ...prev,
            ...categories.filter((item) => item.id == id),
        ]);
        onSelect(id, "delete");
    };

    const handleAdd = (id: string) => {
        onSelect(id, "add");
        setNewData((prev) => prev.filter((item) => item.id != id));
    };

    const handleChange = (e: any) => {
        const newValue = e.target.value;

        if (!/^[a-zA-Z ]*$/.test(newValue)) {
            setError(MESSAGE.ERROR.INVALID_CHARACTER);
            return;
        }
        setCategory(newValue);
    };

    const isFormValid = () => {
        return category.trim() !== "";
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            await fetch(PATHS.API.PROXY.CATEGORY.POST, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: category,
                    type: type,
                    account_id: localStorage.getItem("activeAccount"),
                }),
            }).then((res) => {
                if (res.status === 200) {
                    setIsCategoryInput(false);
                    refetch();
                }
                if (res.status === 400) {
                    setError(MESSAGE.ERROR.EXISTS("Category"));
                }
            });
        }
    };

    const toggleMasonry = () => {
        setIsSelectOpen((prev) => !prev);
        setTouched(true);
    };

    return (
        <>
            {isSelectOpen && (
                <span
                    className="absolute w-full h-full top-0 left-0"
                    onClick={toggleMasonry}
                ></span>
            )}
            <div className="relative">
                <fieldset
                    className={`${
                        touched && required && selected?.length === 0
                            ? "border-red-500"
                            : ""
                    } relative border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2 cursor-pointer`}
                    onClick={toggleMasonry}
                >
                    <legend className="text-sm ms-2 px-1 text-gray-400">
                        {label}{" "}
                        <span className="text-red-500">
                            {required ? "*" : ""}
                        </span>
                    </legend>
                    <span
                        className="absolute right-0 top-[50%] h-full bg-white z-10 flex items-center w-10 justify-center
                         cursor-pointer py-2 box-content -translate-y-[50%]"
                    >
                        <Image
                            src="/icons/chevron-down.svg"
                            width={16}
                            height={13}
                            alt="open dropdown"
                        />
                    </span>
                    <DataSlider
                        remove={handleRemove}
                        categories={selected ? selected : null}
                    />
                </fieldset>
                {isSelectOpen && (
                    <div className="absolute left-0 w-full bg-white py-2 flex flex-col gap-2  border border-gray-200 rounded-md shadow-md px-3">
                        <div className="w-full flex flex-wrap gap-2">
                            {newData.map((category) => (
                                <span
                                    key={category.id}
                                    className="px-2 py-1 border border-authBlack rounded-lg cursor-pointer"
                                    onClick={() =>
                                        handleAdd(
                                            category?.id?.toString() || ""
                                        )
                                    }
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            {isCategoryInput ? (
                                <div className="flex items-center w-full gap-3">
                                    <Input
                                        type="text"
                                        name="category"
                                        value={category}
                                        onChange={handleChange}
                                        label="Category Name"
                                        className="w-full"
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        text="Add"
                                        className="mt-2"
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={handleOpenInput}
                                    className="bg-buttonTeal opacity-50 hover:opacity-100 rounded-lg py-2 transition-all"
                                >
                                    Add Category
                                </button>
                            )}
                            {error && (
                                <span className="text-sm text-red-500">
                                    {error}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
