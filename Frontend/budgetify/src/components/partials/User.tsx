"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookie } from "cookies-next";
import Logout from "./Logout";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import PATHS from "@/paths";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectTrigger } from "../ui/select";
import { SelectItem, SelectValue } from "@radix-ui/react-select";

export default function User() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
    });
    const pathName = usePathname();
    const params = useParams();
    const router = useRouter();

    const getUserData = async () => {
        try {
            const res = await fetch(PATHS.API.PROXY.USER.GET, {
                headers: {
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            });

            return res.json();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const changeLocale = (lang: string) => {
        const languages = ["en", "ka"];
        if (params.locale != lang) {
            console.log("hi");
            router.push(pathName.replace(params.locale.toString(), lang));
        }
    };

    useEffect(() => {
        getUserData().then((data) => {
            if (!data.firstName) redirect(PATHS.AUTH.LOGIN);
            setUserData(data);
        });
    }, []);

    return (
        <div className="flex gap-2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue
                        placeholder={params.locale.toString().toUpperCase()}
                    />
                </SelectTrigger>
                <SelectContent>
                    <div
                        className="cursor-pointer"
                        onClick={() => changeLocale("en")}
                    >
                        EN
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => changeLocale("ka")}
                    >
                        KA
                    </div>
                </SelectContent>
            </Select>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2 items-center outline-none">
                    <span>
                        <Image
                            src="/icons/user.svg"
                            alt="account"
                            width={22}
                            height={22}
                        />
                    </span>
                    {userData.firstName + " " + userData.lastName}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Logout />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
