"use client";

import PATHS from "@/paths";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo() {
    const params = useParams();

    return (
        <div>
            <Link
                href={
                    "/" +
                    params.locale +
                    "/" +
                    PATHS.PAGES(localStorage.getItem("activeAccount") || "")
                        .HOME
                }
            >
                Budgetify
            </Link>
        </div>
    );
}
