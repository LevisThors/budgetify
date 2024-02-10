import { TransactionType } from "@/type/TransactionType";
import { Suspense } from "react";
import Transaction from "../Transaction";

export default function Card({
    transaction,
    currency,
}: {
    transaction: TransactionType;
    currency: string;
}) {
    return (
        <div className="w-full h-[90px] bg-white rounded-lg p-4 relative">
            <div className="flex items-center h-full">
                <div className="w-1/4 h-full bg-gray-100 rounded-lg font-bold flex justify-center items-center">
                    <span className="text-xl">
                        {transaction.categories[0]?.title}
                    </span>
                </div>
                <div className="w-2/4 h-full ps-3">
                    <h1 className="text-lg">{transaction.title}</h1>
                    <p className="text-gray-400">
                        {transaction.type} ·{" "}
                        {new Date(transaction.payment_date).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                            }
                        )}{" "}
                        · {transaction.payee}
                    </p>
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
