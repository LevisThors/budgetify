import { TransactionType } from "@/type/TransactionType";
import { Suspense } from "react";
import Transaction from "../Transaction";
import Image from "next/image";

export default function Card({
    transaction,
    currency,
}: {
    transaction: TransactionType;
    currency: string;
}) {
    return (
        <div className="w-full h-[90px] bg-white rounded-lg px-4 py-3 relative">
            <div className="flex items-center h-full">
                <div className="w-1/4 h-full bg-gray-100 rounded-lg font-bold flex justify-center items-center">
                    <span className="text-xl">
                        {transaction.categories[0]?.title}
                    </span>
                </div>
                <div className="w-2/4 h-full ps-3 flex flex-col justify-between">
                    <h1 className="text-lg">{transaction.title}</h1>
                    <div className="flex gap-1 items-center">
                        <span
                            className={`h-[30px] w-[30px] flex justify-center items-center rounded-full ${
                                transaction.type === "Income"
                                    ? "bg-[#21C206]"
                                    : "bg-[#EE3F19]"
                            }`}
                        >
                            <Image
                                src="/icons/arrow.svg"
                                width={15}
                                height={17}
                                alt="filter-button"
                                className={
                                    transaction.type === "Expenses"
                                        ? "transform rotate-180"
                                        : ""
                                }
                            />
                        </span>
                        <p>
                            {transaction.type} ·{" "}
                            {new Date(
                                transaction.payment_date
                            ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                            })}{" "}
                            {transaction.payee && `· ${transaction.payee}`}
                        </p>
                    </div>
                </div>
                <div className="w-1/4 h-full text-end">
                    <span
                        className={`text-xl ${
                            transaction.type === "Income"
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {transaction.type === "Income" ? "" : "-"}
                        {transaction.amount}
                        {currency}
                    </span>
                </div>
            </div>
            <Suspense>
                <Transaction transaction={transaction} />
            </Suspense>
        </div>
    );
}
