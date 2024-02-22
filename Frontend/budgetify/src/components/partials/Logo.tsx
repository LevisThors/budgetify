"use client";

import PATHS from "@/paths";
import Link from "next/link";

export default function Logo() {
    return (
        <div>
            <Link
                href={
                    PATHS.PAGES(localStorage.getItem("activeAccount") || "")
                        .HOME
                }
            >
                Budgetify
            </Link>
        </div>
    );
}
