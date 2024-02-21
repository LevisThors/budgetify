"use client";

import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch(PATHS.API.PROXY.AUTH.GET_CSRF, {
                method: "GET",
                credentials: "include",
            });

            const res = await fetch(PATHS.API.PROXY.AUTH.LOGOUT, {
                method: "POST",
                headers: {
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            });

            if (res.status === 200) {
                router.push(PATHS.AUTH.LOGIN);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}
