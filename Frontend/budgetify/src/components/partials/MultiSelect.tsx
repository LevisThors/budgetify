"use client";

import { CategoryType } from "@/type/CategoryType";
import { useState } from "react";
import DataSlider from "./DataSlider";
import Image from "next/image";

interface MultiSelectProps {
    label: string;
    required?: boolean;
    categories: CategoryType[];
    onSelect: (id: string, action: "add" | "delete") => void;
    selected?: CategoryType[];
}
export default function MultiSelect({
    label,
    required,
    categories,
    onSelect,
    selected,
}: MultiSelectProps) {
    const [newData, setNewData] = useState<CategoryType[]>(categories);
    const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
    const [touched, setTouched] = useState<boolean>(false);

    const handleRemove = (id: string) => {
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
                    } border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2`}
                >
                    <legend className="text-sm ms-2 px-1 text-gray-400">
                        {label}{" "}
                        <span className="text-red-500">
                            {required ? "*" : ""}
                        </span>
                    </legend>
                    <span
                        className="absolute right-0 top-0 h-full bg-white z-10 flex items-center w-10 justify-center"
                        onClick={toggleMasonry}
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
                    <div className="absolute left-0 w-full bg-white py-2 flex flex-wrap gap-2 border border-gray-200 rounded-md shadow-md px-3">
                        {newData.map((category) => (
                            <span
                                key={category.id}
                                className="px-2 py-1 border border-authBlack rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleAdd(category?.id?.toString() || "")
                                }
                            >
                                {category.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
