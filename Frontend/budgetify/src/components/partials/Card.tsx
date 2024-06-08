import { Suspense } from "react";
import Transaction from "../Transaction";
import Image from "next/image";
import Subscription from "../Subscription";
import ItemLoading from "./ItemLoading";
import Obligatory from "../Obligatory";
import { getTranslations } from "next-intl/server";

export default async function Card({
    transaction,
    currency,
    page,
}: {
    transaction: any;
    currency: string;
    page?: "transactions" | "subscriptions" | "obligatories";
}) {
    const t = await getTranslations("Card");

    return (
        <div className="w-full h-[90px] bg-white rounded-lg px-4 py-3 relative">
            <Suspense>
                <ItemLoading item={transaction} />
            </Suspense>
            <div
                className={`flex items-center h-full ${
                    page === "obligatories" ? "justify-between" : ""
                }`}
            >
                {page !== "obligatories" && (
                    <div className="w-1/4 h-full bg-gray-100 rounded-lg font-bold flex justify-center items-center">
                        <span className="text-xl">
                            {transaction.categories[0]?.title}
                        </span>
                    </div>
                )}
                <div className="w-2/4 h-full ps-3 flex flex-col justify-between">
                    <h1 className="text-lg">{transaction.title}</h1>
                    <div className="flex gap-1 items-center">
                        {page === "transactions" ? (
                            <>
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
                                    {t(transaction.type.toLowerCase())} ·{" "}
                                    {new Date(
                                        transaction.payment_date
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    })}{" "}
                                    {transaction.payee &&
                                        `· ${transaction.payee}`}
                                </p>
                            </>
                        ) : (
                            <p>
                                {page === "subscriptions" ? (
                                    <>
                                        {t("nextDate")}:{" "}
                                        <strong>
                                            {transaction.first_payment_date}
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        {t("dates")}:{" "}
                                        <strong>
                                            {transaction.first_payment_date} -{" "}
                                            {transaction.second_payment_date}
                                        </strong>
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                </div>
                {page === "obligatories" && !transaction.amount ? (
                    ""
                ) : (
                    <div className="w-1/4 h-full text-end">
                        <span
                            className={`text-xl ${
                                page === "transactions"
                                    ? transaction.type === "Income"
                                        ? "text-green-500"
                                        : "text-red-500"
                                    : "text-red-500"
                            }`}
                        >
                            {page === "transactions"
                                ? transaction.type === "Income"
                                    ? ""
                                    : "-"
                                : ""}
                            {transaction.amount}
                            {currency}
                        </span>
                    </div>
                )}
            </div>
            <Suspense>
                {page === "transactions" && (
                    <Transaction transaction={transaction} />
                )}
                {page === "subscriptions" && (
                    <Subscription subscription={transaction} />
                )}
                {page === "obligatories" && (
                    <Obligatory obligatory={transaction} />
                )}
            </Suspense>
        </div>
    );
}
