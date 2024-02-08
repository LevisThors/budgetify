import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cookies } from "next/headers";
import Logout from "./Logout";
import { redirect } from "next/navigation";
import Image from "next/image";

export async function getUserData() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
            {
                headers: {
                    Cookie: `laravel_session=${
                        cookies().get("laravel_session")?.value
                    }`,
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            }
        );

        return res.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

export default async function User() {
    let userData;

    try {
        userData = await getUserData();
        if (!userData.firstName) redirect("/auth/login");
    } catch (error) {
        redirect("/auth/login");
    }

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
