"use client";

import { useEffect, useState } from "react";
import BarChart from "./partials/BarChart";
import { DateRangePicker } from "./partials/DateRangePicker";
import { DateRange } from "react-day-picker";
import currencyToSymbol from "@/util/currencyToSymbol";
import { DataTable } from "./partials/DataTable";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { MonthlyDataTable } from "./partials/MonthlyDataTable";
import { format } from "date-fns";
import LineChart from "./partials/LineChart";
import Link from "next/link";
import PATHS from "@/paths";
import { CheckboxDropdown } from "./partials/CheckboxDropdown";

export default function Statistics({
    statistics,
    monthlyStatistics,
    accountId,
}: {
    statistics: any;
    monthlyStatistics: any;
    accountId: string;
}) {
    const [activeCategory, setActiveCategory] = useState<
        "Categories" | "Monthly"
    >("Categories");
    const { currency, ...statisticsWithoutCurrency } = statistics;
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();
    const [t, setT] = useState<{
        [key: string]: string;
    }>({});
    const totalSpent = Object.entries(statisticsWithoutCurrency).reduce(
        (acc, [_, value]: any) => {
            return acc + value;
        },
        0
    );

    const handleDateChange = (date: DateRange | undefined) => {
        router.push(
            pathname +
                `?date=${date?.from ? format(date?.from, "yyyy-MM-dd") : ""},${
                    date?.to ? format(date?.to, "yyyy-MM-dd") : ""
                }`
        );
    };

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../messages/${params.locale}.json`
            );
            setT(messageData.Statistics);
        };

        getMessage();
    }, [params.locale]);

    if (Object.entries(t).length === 0) return;

    return (
        <section className="flex h-fit w-full justify-between px-10 gap-10">
            <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between">
                    <div className="flex border border-neutral-800 rounded-lg h-fit cursor-pointer bg-white w-fit">
                        <span
                            className={`border-r border-neutral-800 rounded-lg px-3 py-2 ${
                                activeCategory !== "Categories"
                                    ? "opacity-50"
                                    : ""
                            }`}
                            onClick={() => setActiveCategory("Categories")}
                        >
                            {t.category}
                        </span>
                        <span
                            className={`px-3 py-2 w-fit ${
                                activeCategory !== "Monthly" ? "opacity-50" : ""
                            }`}
                            onClick={() => setActiveCategory("Monthly")}
                        >
                            {t.monthly}
                        </span>
                    </div>
                    <Link
                        className={`bg-buttonTeal text-authBlack py-3 px-4 rounded-md`}
                        href={
                            activeCategory === "Categories"
                                ? `${PATHS.API.PROXY.STATISTIC.DOWNLOAD_CATEGORY(
                                      accountId
                                  )}
                                  ${
                                      searchParams.get("categories") != null
                                          ? `&categories=${searchParams.get(
                                                "categories"
                                            )}`
                                          : ""
                                  }`
                                : PATHS.API.PROXY.STATISTIC.DOWNLOAD_MONTHLY(
                                      accountId
                                  )
                        }
                    >
                        {t.download}
                    </Link>
                </div>
                {activeCategory === "Categories" ? (
                    <>
                        <DateRangePicker
                            type="filter"
                            onDateChange={handleDateChange}
                        />
                        <CheckboxDropdown title={t.selectedCategories} />
                        <div className="bg-white flex rounded-md overflow-hidden py-2 px-4 flex-col">
                            <span className="text-xs text-gray-400 ">
                                {t.total}
                            </span>
                            <span className="text-lg text-red-500 font-medium">
                                {totalSpent}
                                {currencyToSymbol(statistics.currency)}
                            </span>
                        </div>
                        <DataTable
                            categoryStatistics={statisticsWithoutCurrency}
                            headerTranslations={t.headers}
                            currency={currency}
                        />
                    </>
                ) : (
                    <>
                        <DateRangePicker
                            type="filter"
                            onDateChange={handleDateChange}
                        />
                        <div className="bg-white flex rounded-md overflow-hidden py-2 px-4 flex-col">
                            <span className="text-xs text-gray-400 ">
                                {t.total}
                            </span>
                            <span className="text-lg text-red-500 font-medium">
                                {totalSpent}
                                {currencyToSymbol(statistics.currency)}
                            </span>
                        </div>
                        <MonthlyDataTable
                            monthlyStatistics={monthlyStatistics}
                            headerTranslations={t.headers}
                            currency={currency}
                        />
                        <LineChart data={monthlyStatistics} />
                    </>
                )}
            </div>
            {activeCategory === "Categories" ? (
                <BarChart categoryStatistics={statisticsWithoutCurrency} />
            ) : (
                <div className="w-1/2"></div>
            )}
        </section>
    );
}
