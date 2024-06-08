"use client";

import { usePathname } from "next/navigation";

export default function ActivePath({ path }: { path: string }) {
    const currentPath = usePathname();
    const isActive = currentPath === path;

    if (!isActive) return;

    return <span className="h-[1px] bg-black w-full flex mt-1 px-2"></span>;
}
