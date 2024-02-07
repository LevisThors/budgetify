"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Get CSRF token
            await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`,
                {
                    method: "POST",
                    headers: {
                        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    },
                    credentials: "include",
                }
            );

            if (res.status === 200) {
                router.push("/auth/login");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}
