"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SortBy({
    type,
}: {
    type?: "transactions" | "subscriptions" | "obligatories";
}) {
    const pathname = usePathname();
    const searchQuery = useSearchParams().get("query");
    const sortQuery = useSearchParams().get("sort");
    const typeQuery = useSearchParams().get("type");
    const [currentFilter, setCurrentFilter] = useState(true);
    const params = useParams();

    const [filterButtons, setFilterButtons] = useState<{
        [key: string]: string;
    }>({});

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setFilterButtons(messageData.Filters);
        };

        getMessage();
    }, [params.locale]);

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
        <Link
            href={`${finalUrl}${
                type === "transactions" ? "payment_date" : "created_at"
            }-${currentFilter ? "desc" : "asc"}`}
            onClick={() => setCurrentFilter((prev) => !prev)}
            className="flex gap-1 px-4"
        >
            <span>
                <Image
                    src="/icons/sort.svg"
                    alt="account"
                    width={22}
                    height={22}
                />
            </span>
            <span>{filterButtons.transDate}</span>
        </Link>
    );
}
