import PATHS from "@/paths";
import { cookies } from "next/headers";

export async function getUserData() {
    try {
        const res = await fetch(PATHS.API.BASE.USER.GET, {
            headers: {
                Cookie: `laravel_session=${
                    cookies().get("laravel_session")?.value
                }`,
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        });

        return res.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
