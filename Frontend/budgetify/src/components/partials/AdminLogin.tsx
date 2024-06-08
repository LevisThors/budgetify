"use client";

import AuthInput from "@/components/partials/AuthInput";
import Button from "@/components/partials/Button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";
import revalidate from "@/util/revalidate";
import PATHS from "@/paths";
import MESSAGE from "@/messages";
import Input from "./Input";

const registerFields = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    date: "",
    country: "US",
};

export default function AdminLogin() {
    const [loginData, setLoginData] = useState(registerFields);
    const [errors, setErrors] = useState(registerFields);
    const [validationError, setValidationError] = useState("");
    const router = useRouter();
    const params = useParams();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "email") {
            const emailRegex = /^[^@]+@[^@]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: MESSAGE.ERROR.INVALID_INPUT("email"),
                }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        loginData.email != "" &&
        loginData.password != "" &&
        loginData.country != "" &&
        loginData.date != "" &&
        loginData.firstName != "" &&
        loginData.lastName != "" &&
        loginData.gender != "";

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!isFormValid) return;

        await fetch(PATHS.API.PROXY.AUTH.GET_CSRF, {
            headers: {
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        });

        const response = await fetch(PATHS.API.PROXY.AUTH.ADMIN, {
            credentials: "include",
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-xsrf-token": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                first_name: loginData.firstName,
                last_name: loginData.lastName,
                email: loginData.email,
                date_of_birth: loginData.date,
                country: loginData.country,
                gender: loginData.gender,
                password: loginData.password,
                password_confirmation: loginData.confirmPassword,
            }),
        });

        if (response.status === 200) {
            await revalidate();
            router.push(`/${params.locale}/${PATHS.PAGES("account").HOME}`);
        } else if (response.status === 401) {
            setValidationError(
                MESSAGE.ERROR.INVALID_INPUT("email or password")
            );
        }
    };

    console.log(isFormValid);
    console.log(loginData);
    return (
        <div className="bg-white bg-opacity-80 z-10 rounded-md px-[80px] py-[70px] flex flex-col justify-center items-center w-fit gap-9">
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
                <Input
                    type="date"
                    name="date"
                    label="Date of birth"
                    required={true}
                    value={loginData.date}
                    onChange={handleChange}
                />
                <Input
                    type="select"
                    name="gender"
                    label="Gender"
                    required={true}
                    value={loginData.gender}
                    options={["Male", "Female"]}
                    onChange={handleChange}
                />
                <Input
                    type="select"
                    name="country"
                    label="Country"
                    required={true}
                    value={loginData.country}
                    options={["US", "UK"]}
                    onChange={handleChange}
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
                </div>

                <Button
                    text="Register"
                    active={!!isFormValid}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
