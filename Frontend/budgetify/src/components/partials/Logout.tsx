"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch(`/backend/sanctum/csrf-cookie`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                },
            });

            const res = await fetch(`/backend/api/logout`, {
                method: "POST",
                headers: {
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            });

            if (res.status === 200) {
                router.push("/auth/login");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}
