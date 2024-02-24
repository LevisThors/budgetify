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

export function DateRangePicker({
    className,
    onDateChange,
}: {
    className?: React.HTMLAttributes<HTMLDivElement>;
    onDateChange: (date: DateRange | undefined) => void;
}) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined,
    });

    React.useEffect(() => {
        onDateChange(date);
    }, [date, onDateChange]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <fieldset className="border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2">
                        <legend className="text-sm ms-2 px-1 text-gray-400">
                            Payment Dates{" "}
                            <span className="text-red-500">*</span>
                        </legend>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-between text-left font-normal flex border-none",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "dd.MM.yyyy")} -{" "}
                                        {format(date.to, "dd.MM.yyyy")}
                                    </>
                                ) : (
                                    format(date.from, "dd.MM.yyyy")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="mr-2 h-4 w-4" />
                        </Button>
                    </fieldset>
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
