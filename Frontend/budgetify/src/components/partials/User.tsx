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
import PATHS from "@/paths";

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

export default async function User() {
    let userData;

    try {
        userData = await getUserData();
        if (!userData.firstName) redirect(PATHS.AUTH.LOGIN);
    } catch (error) {
        redirect(PATHS.AUTH.LOGIN);
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
