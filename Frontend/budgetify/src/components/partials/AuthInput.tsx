"use client";
import { useState } from "react";
import Image from "next/image";

interface AuthInputProps {
    type: string;
    name: string;
    label: string;
    error?: string;
    required?: boolean;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthInput({
    type,
    name,
    label,
    error,
    required = true,
    value,
    handleChange,
}: AuthInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [throwRequired, setThrowRequired] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleBlur = () => {
        setIsFocused(false);

        if (value === "" && required) {
            setThrowRequired(true);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="w-fit h-fit relative flex flex-col">
            <div className="max-h-fit relative">
                <label
                    htmlFor={name}
                    className={`absolute left-3 ${
                        isFocused || value ? "top-3 text-xs" : "top-1/2 text-lg"
                    } -translate-y-1/2 transition-all duration-200 cursor-text`}
                >
                    {label}
                </label>
                <input
                    type={
                        type === "password"
                            ? showPassword
                                ? "text"
                                : type
                            : type
                    }
                    name={name}
                    id={name}
                    required={required}
                    value={value}
                    className={`border border-authBlack rounded-md h-[55px] w-[350px] px-3 text-sm
                ${(throwRequired || error) && "border-red-500"}`}
                    onFocus={() => setIsFocused(true)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {type === "password" && (
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={handleTogglePassword}
                    >
                        <Image
                            src="/icons/eye.svg"
                            alt="eye"
                            width={28}
                            height={28}
                        />
                    </span>
                )}
            </div>
            <div>
                {(throwRequired || error) && (
                    <span className="text-xs text-red-500">
                        {error ? error : "Required field is empty"}
                    </span>
                )}
            </div>
        </div>
    );
}
