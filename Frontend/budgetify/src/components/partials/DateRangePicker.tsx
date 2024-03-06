"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

export function DateRangePicker({
    className,
    onDateChange,
    originalDate,
    type,
}: {
    className?: React.HTMLAttributes<HTMLDivElement>;
    type?: "input" | "filter";
    onDateChange: (date: DateRange | undefined) => void;
    originalDate?: DateRange | undefined;
}) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from:
            originalDate?.from ||
            new Date(new Date().setMonth(new Date().getMonth() - 5)),
        to: originalDate?.to || new Date(),
    });

    React.useEffect(() => {
        onDateChange(date);
    }, [date, onDateChange]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    {type === "filter" ? (
                        <div className="bg-white flex rounded-md overflow-hidden py-1 flex-col relatiove">
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full h-full justify-between text-left font-normal flex items-center border-none py-2",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">
                                        Date Range{" "}
                                    </span>
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    "dd.MM.yyyy"
                                                )}{" "}
                                                -{" "}
                                                {format(date.to, "dd.MM.yyyy")}
                                            </>
                                        ) : (
                                            format(date.from, "dd.MM.yyyy")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </div>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <fieldset className="border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2">
                            <legend className="text-sm ms-2 px-1 text-gray-400">
                                Payment Dates{" "}
                                <span className="text-red-500">*</span>
                            </legend>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-between text-left font-normal flex border-none text-base",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(
                                                            date.from,
                                                            "dd.MM.yyyy"
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            date.to,
                                                            "dd.MM.yyyy"
                                                        )}
                                                    </>
                                                ) : (
                                                    format(
                                                        date.from,
                                                        "dd.MM.yyyy"
                                                    )
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Select date range: from - to</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </fieldset>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
