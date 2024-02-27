"use client";

import { useState } from "react";
import BarChart from "./partials/BarChart";
import { DateRangePicker } from "./partials/DateRangePicker";
import { DateRange } from "react-day-picker";
import currencyToSymbol from "@/util/currencyToSymbol";
import { DataTable } from "./partials/DataTable";

export default function Statistics({ statistics }: { statistics: any }) {
    const [activeCategory, setActiveCategory] = useState<
        "Categories" | "Monthly"
    >("Categories");

    const { currency, ...statisticsWithoutCurrency } = statistics;

    const totalSpent = Object.entries(statisticsWithoutCurrency).reduce(
        (acc, [_, value]: any) => {
            return acc + value;
        },
        0
    );

    console.log(totalSpent);

    const handleDateChange = (date: DateRange | undefined) => {
        console.log(date);
    };

    return (
        <section className="flex h-fit w-full justify-around">
            <div className="flex flex-col gap-3">
                <div className="flex border border-neutral-800 rounded-lg h-fit cursor-pointer bg-white">
                    <span
                        className={`border-r border-neutral-800 rounded-lg px-3 py-2 ${
                            activeCategory !== "Categories" ? "opacity-50" : ""
                        }`}
                    >
                        Categories Statistic
                    </span>
                    <span
                        className={`px-3 py-2 ${
                            activeCategory !== "Monthly" ? "opacity-50" : ""
                        }`}
                    >
                        Monthly Statistic
                    </span>
                </div>
                <DateRangePicker
                    type="filter"
                    onDateChange={handleDateChange}
                />
                <div className="bg-white flex rounded-md overflow-hidden py-2 px-4 flex-col">
                    <span className="text-xs text-gray-400 ">
                        Total Expenses
                    </span>
                    <span className="text-lg text-red-500 font-medium">
                        {totalSpent}
                        {currencyToSymbol(statistics.currency)}
                    </span>
                </div>
                <DataTable
                    categoryStatistics={statisticsWithoutCurrency}
                    currency={currency}
                />
            </div>
            <BarChart categoryStatistics={statisticsWithoutCurrency} />
        </section>
    );
}
