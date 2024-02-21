"use client";

import { useEffect, useState } from "react";

export default function ActionButton({
    text,
    needsAccount,
}: {
    text: string;
    needsAccount?: boolean;
}) {
    const [hasActiveAccount, setHasActiveAccount] = useState(false);
    const isAdd = text.split(" ")[0].toLowerCase() === "add";

    useEffect(() => {
        if (needsAccount) {
            setHasActiveAccount(!!localStorage.getItem("activeAccount"));
        }
    }, [needsAccount]);

    if (needsAccount && !hasActiveAccount) {
        return null;
    }

    return (
        <div className="bg-buttonTeal text-authBlack py-1 px-4 rounded-lg flex items-center gap-2">
            {isAdd && (
                <span className="flex w-[35px] h-[35px] bg-white text-buttonTeal rounded-full items-center justify-center text-4xl">
                    +
                </span>
            )}
            <span className="font-medium">{text}</span>
        </div>
    );
}
