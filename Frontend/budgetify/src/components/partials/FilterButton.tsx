"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterButtonData {
    [key: string]: string;
}

export default function FilterButton({ type }: { type: string }) {
    const pathname = usePathname();
    const searchQuery = useSearchParams().get("query");
    const sortQuery = useSearchParams().get("sort");
    const typeQuery = useSearchParams().get("type");
    const [filterButtons, setFilterButtons] = useState<FilterButtonData>({});
    const params = useParams();

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setFilterButtons(messageData.Filters);
        };

        getMessage();
    }, [params.locale]);

    const active = typeQuery === type;
    let finalUrl = pathname;

    if ((searchQuery === null || searchQuery === "") && sortQuery === null) {
        finalUrl = `${finalUrl}?type=${type}`;
    } else {
        if (searchQuery && sortQuery) {
            finalUrl = `${finalUrl}?query=${searchQuery}&sort=${sortQuery}&type=${type}`;
        } else if (searchQuery) {
            finalUrl = `${finalUrl}?query=${searchQuery}&type=${type}`;
        } else if (sortQuery) {
            finalUrl = `${finalUrl}?sort=${sortQuery}&type=${type}`;
        }
    }

    return (
        <Link
            href={active ? pathname : finalUrl}
            className={`flex bg-white py-1 px-4 rounded-lg items-center gap-2 border ${
                active ? "border-authBlack" : "border-transparent"
            }`}
        >
            <span
                className={`h-[35px] w-[35px] flex justify-center items-center rounded-full ${
                    type === "Income" ? "bg-[#21C206]" : "bg-[#EE3F19]"
                }`}
            >
                <Image
                    src="/icons/arrow.svg"
                    width={15}
                    height={17}
                    alt="filter-button"
                    className={
                        type === "Expenses" ? "transform rotate-180" : ""
                    }
                />
            </span>
            <span className="font-medium">
                {filterButtons[type.toLowerCase()]}
            </span>
        </Link>
    );
}
