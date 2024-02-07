"use client";

import AuthInput from "@/components/partials/AuthInput";
import Button from "@/components/partials/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";

const registerFields = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
};

export default function Login() {
    const [loginData, setLoginData] = useState(registerFields);
    const [errors, setErrors] = useState(registerFields);
    const [validationError, setValidationError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") {
            const emailRegex = /^[^@]+@[^@]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Please enter a valid email address",
                }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        loginData.email &&
        loginData.password &&
        !errors.email &&
        !errors.password;

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!isFormValid) return;

        await fetch("/backend/sanctum/csrf-cookie", {
            credentials: "include",
        });

        const response = await fetch("/backend/api/register", {
            credentials: "include",
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-xsrf-token": getCookie("XSRF-TOKEN") || "",
            },
            body: JSON.stringify({
                first_name: loginData.firstName,
                last_name: loginData.lastName,
                email: loginData.email,
                password: loginData.password,
                password_confirmation: loginData.confirmPassword,
            }),
        });

        if (response.status === 200) {
            router.push("/dashboard/account/transactions");
        } else if (response.status === 401) {
            setValidationError("Invalid email or password");
        }
    };

    return (
        <div className="bg-white bg-opacity-80 z-10 rounded-md px-[80px] py-[70px] flex flex-col justify-center items-center w-fit">
            <h1 className="text-4xl">Budgetify</h1>
            <div className="flex flex-col gap-[30px] opacity-100">
                <div className="flex flex-col gap-1">
                    {validationError && (
                        <div className="w-full p-2 bg-red-500 bg-opacity-50 text-authBlack flex justify-between text-sm rounded-md">
                            <span>{validationError}</span>
                            <button onClick={() => setValidationError("")}>
                                X
                            </button>
                        </div>
                    )}
                    <AuthInput
                        type="text"
                        name="firstName"
                        label="First Name"
                        required={true}
                        value={loginData.firstName}
                        error={errors.firstName}
                        handleChange={handleChange}
                    />
                </div>
                <AuthInput
                    type="text"
                    name="lastName"
                    label="Last Name"
                    required={true}
                    value={loginData.lastName}
                    error={errors.lastName}
                    handleChange={handleChange}
                />
                <AuthInput
                    type="email"
                    name="email"
                    label="Email"
                    required={true}
                    value={loginData.email}
                    error={errors.email}
                    handleChange={handleChange}
                />
                <AuthInput
                    type="password"
                    name="password"
                    label="Password"
                    required={true}
                    value={loginData.password}
                    error={errors.password}
                    handleChange={handleChange}
                />
                <div>
                    <AuthInput
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        required={true}
                        value={loginData.confirmPassword}
                        error={errors.confirmPassword}
                        handleChange={handleChange}
                    />
                    <Link href="/auth/login" className="text-sm underline">
                        Already have an account?
                    </Link>
                </div>

                <Button
                    text="Register"
                    active={isFormValid ? true : false}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
