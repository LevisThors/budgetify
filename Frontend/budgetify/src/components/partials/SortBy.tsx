"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "../ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function SortBy() {
    const pathname = usePathname();
    const searchQuery = useSearchParams().get("query");
    const sortQuery = useSearchParams().get("sort");
    const typeQuery = useSearchParams().get("type");

    const active = sortQuery;
    let finalUrl = pathname;

    if ((searchQuery === null || searchQuery === "") && typeQuery === null) {
        finalUrl = `${finalUrl}?sort=`;
    } else {
        if (searchQuery && typeQuery) {
            finalUrl = `${finalUrl}?query=${searchQuery}&type=${typeQuery}&sort=`;
        } else if (searchQuery) {
            finalUrl = `${finalUrl}?query=${searchQuery}&sort=`;
        } else if (typeQuery) {
            finalUrl = `${finalUrl}?type=${typeQuery}&sort=`;
        }
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
                {active}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`${finalUrl}transaction-date`}>
                        Transaction Date
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
