"use client";

import { useEffect, useState } from "react";
import MESSAGE from "@/messages";
import { useParams } from "next/navigation";

interface InputProps {
    value: string;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    type?: "select" | "text" | "number" | "date" | "multiselect";
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    maxLength?: number;
    options?: string[];
    defaultOption?: string;
    disabled?: boolean;
}

export default function Input({
    value,
    onChange,
    type = "text",
    name,
    label,
    required = false,
    className = "",
    maxLength = 255,
    options,
    defaultOption,
    disabled,
}: InputProps) {
    const [throwRequired, setThrowRequired] = useState(false);
    const [throwMaxLengthError, setThrowMaxLengthError] = useState(false);
    const [t, setT] = useState<{
        [key: string]: string;
    }>({});
    const params = useParams();

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setT(messageData.Input);
        };

        getMessage();
    }, [params.locale]);

    const handleBlur = () => {
        if (value === "" && required) {
            setThrowRequired(true);
        }
        if (value.length > maxLength) {
            setThrowMaxLengthError(true);
        }
    };

    return (
        <div className="w-full">
            <fieldset
                className={`${throwRequired ? "border-red-500" : ""} ${
                    disabled ? "opacity-50" : ""
                } border border-gray-400 h-[65px] flex items-center rounded-md bg-white overflow-hidden pb-2`}
            >
                <legend className="text-sm ms-2 px-1 text-gray-400">
                    {label}{" "}
                    <span className="text-red-500">{required ? "*" : ""}</span>
                </legend>
                {type === "select" && options ? (
                    <select
                        name={name}
                        className={`outline-none w-full h-full px-3 font-medium `}
                        value={value ? value : defaultOption}
                        onChange={onChange}
                    >
                        {options.map((option) => (
                            <option
                                key={option}
                                value={option}
                                className="py-3"
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`outline-none w-full h-full px-3 font-medium ${className}`}
                        onBlur={handleBlur}
                    />
                )}
            </fieldset>
            <span className="text-red-500 text-sm">
                {throwMaxLengthError
                    ? MESSAGE.ERROR.MAX_LENGTH(maxLength)
                    : throwRequired && t["required"]}{" "}
            </span>
        </div>
    );
}
