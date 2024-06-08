"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PATHS from "@/paths";
import { getCookie } from "cookies-next";
import { CategoryType } from "@/type/CategoryType";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CheckboxDropdown({ title }: { title: string }) {
    const [categories, setCategories] = React.useState([]);
    const [checked, setChecked] = React.useState<string[]>([]);
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();

    const checkToggle = (e: any, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (checked.includes(id)) {
            const updatedChecked = checked.filter((itemId) => itemId !== id);
            setChecked(updatedChecked);
            router.push(
                `${path}?date=${searchParams.get(
                    "date"
                )}&categories=${updatedChecked.join(",")}`
            );
        } else {
            setChecked((prevChecked) => [...prevChecked, id]);
            router.push(
                `${path}?date=${searchParams.get(
                    "date"
                )}&categories=${checked.join(",")},${id}`
            );
        }
    };

    React.useEffect(() => {
        const getCategories = async () => {
            const res = await fetch(
                `${
                    PATHS.API.PROXY.CATEGORY.GET
                }?unordered=true&account_id=${localStorage.getItem(
                    "activeAccount"
                )}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `laravel_session=${getCookie(
                            "laravel_session"
                        )}`,
                        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                        "ngrok-skip-browser-warning": "69420",
                    },
                    credentials: "include",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await res.json();
            return data;
        };

        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
            setChecked((prev) => {
                return data.map((d: CategoryType) => d.id);
            });
        };

        fetchCategories();
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {title} -{" "}
                    {categories.map((cat: CategoryType) =>
                        checked.includes(cat.id as string) ? (
                            <span
                                key={cat.id}
                                className="py-0.5 px-2 border border-solid rounded-md border-neutral-800 mx-1"
                            >
                                {cat.title}
                            </span>
                        ) : (
                            ""
                        )
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {categories.map((category: CategoryType) => {
                    return (
                        <DropdownMenuCheckboxItem
                            checked={checked.includes(category.id as string)}
                            onClick={(e) =>
                                checkToggle(e, category.id as string)
                            }
                            key={category.id}
                        >
                            {category.title}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
