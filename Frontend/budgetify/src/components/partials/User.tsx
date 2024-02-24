"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookie } from "cookies-next";
import Logout from "./Logout";
import { redirect } from "next/navigation";
import Image from "next/image";
import PATHS from "@/paths";
import { useEffect, useState } from "react";

export default function User() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
    });

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

    useEffect(() => {
        getUserData().then((data) => {
            if (!data.firstName) redirect(PATHS.AUTH.LOGIN);
            setUserData(data);
        });
    }, []);

    return (
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
    );
}
