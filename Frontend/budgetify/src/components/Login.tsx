"use client";

import AuthInput from "@/components/partials/AuthInput";
import Button from "@/components/partials/Button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";
import revalidate from "@/util/revalidate";
import PATHS from "@/paths";

const loginFields = {
    email: "",
    password: "",
};

export default function Login({ errorMessage }: { errorMessage: string }) {
    const [loginData, setLoginData] = useState(loginFields);
    const [errors, setErrors] = useState(loginFields);
    const [validationError, setValidationError] = useState("");
    const params = useParams();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") {
            const emailRegex = /^[^@]+@[^@]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: errorMessage,
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

        await fetch(PATHS.API.PROXY.AUTH.GET_CSRF, {
            credentials: "include",
            headers: {
                "ngrok-skip-browser-warning": "69420",
            },
        });

        const response = await fetch(PATHS.API.PROXY.AUTH.LOGIN, {
            credentials: "include",
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-xsrf-token": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password,
            }),
        });

        if (response.status === 200) {
            await revalidate();
            router.push(
                `/${params.locale}/${
                    PATHS.PAGES(localStorage.getItem("activeAccount") || "")
                        .HOME
                }`
            );
        } else if (response.status === 401) {
            setValidationError(errorMessage);
        }
    };

    return (
        <div className="bg-white bg-opacity-80 z-10 rounded-md px-[80px] py-[70px] flex flex-col justify-center items-center w-fit gap-9">
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
                        type="email"
                        name="email"
                        label="Email"
                        required={true}
                        value={loginData.email}
                        error={errors.email}
                        handleChange={handleChange}
                    />
                </div>
                <div>
                    <AuthInput
                        type="password"
                        name="password"
                        label="Password"
                        required={true}
                        value={loginData.password}
                        error={errors.password}
                        handleChange={handleChange}
                    />
                    <Link
                        href={PATHS.AUTH.REGISTER}
                        className="text-sm underline"
                    >
                        Create account
                    </Link>
                </div>
                <Button
                    text="Login"
                    active={!!isFormValid}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
