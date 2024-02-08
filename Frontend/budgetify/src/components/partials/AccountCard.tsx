"use client";

import { AccountType } from "@/type/AccountType";
import currencyToSymbol from "@/util/currencyToSymbol";

interface AccountCardProps {
    activeAccount: string | number | null;
    account: AccountType;
    handleClick: (id: string | number) => void;
}

export default function AccountCard({
    activeAccount,
    account,
    handleClick,
}: AccountCardProps) {
    return (
        <li
            className={`flex justify-between w-[400px] h-[185px] relative bg-gradient-linear rounded-xl p-5 cursor-pointer ${
                activeAccount == account.id ? "shadow-2xl" : "opacity-50"
            }`}
            onClick={() => handleClick(account.id || "")}
        >
            <div className="z-10 flex flex-col gap-7 h-full justify-center text-white">
                <span className="text-3xl text-start">{account.title}</span>
                <span className="text-5xl text-start">{account.balance}</span>
            </div>
            <div className="z-10 bg-white w-[90px] h-[90px] rounded-full flex justify-center items-center overflow-hidden">
                <span className="text-6xl text-cutout bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
                    {currencyToSymbol(account.currency)}
                </span>
            </div>
        </li>
    );
}
