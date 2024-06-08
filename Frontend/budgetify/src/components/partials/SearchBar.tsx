"use client";

import Image from "next/image";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();
    const { replace } = useRouter();
    const sortQuery = useSearchParams().get("sort");
    const typeQuery = useSearchParams().get("type");
    const [filterButtons, setFilterButtons] = useState<{
        [key: string]: string;
    }>({});
    const params = useParams();

    const handleChange = (e: any) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setFilterButtons(messageData.Filters);
        };

        getMessage();
    }, [params.locale]);

    useEffect(() => {
        let finalUrl = pathname;

        if (typeQuery === null && sortQuery === null) {
            finalUrl = `${finalUrl}?query=${searchQuery}`;
        } else {
            if (typeQuery && sortQuery) {
                finalUrl = `${finalUrl}?type=${typeQuery}&sort=${sortQuery}&query=${searchQuery}`;
            } else if (typeQuery) {
                finalUrl = `${finalUrl}?type=${typeQuery}&query=${searchQuery}`;
            } else if (sortQuery) {
                finalUrl = `${finalUrl}?sort=${sortQuery}&query=${searchQuery}`;
            }
        }

        replace(finalUrl);
    }, [searchQuery, pathname, replace, sortQuery, typeQuery]);

    return (
        <div className="flex w-full justify-between items-center bg-white rounded-lg">
            <div className="px-2 ps-4">
                <Image
                    src="/icons/search.png"
                    width={25}
                    height={25}
                    alt="search"
                    className="opacity-70"
                />
            </div>
            <input
                type="text"
                placeholder={filterButtons.search}
                className="w-full py-2 px-2 rounded-lg h-[55px] text-lg outline-none placeholder:text-authBlack"
                onChange={handleChange}
                value={searchQuery}
            />
        </div>
    );
}
