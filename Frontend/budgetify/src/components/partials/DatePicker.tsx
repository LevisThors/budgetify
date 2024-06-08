"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function DatePicker({
    originalDate,
    onDateChange,
}: {
    originalDate: Date | undefined;
    onDateChange: (date: Date) => void;
}) {
    const [date, setDate] = useState<Date | undefined>(
        originalDate || new Date()
    );
    const params = useParams();
    const [t, setT] = useState<{ [key: string]: string }>();

    useEffect(() => {
        const getMessage = async () => {
            const messageData = await import(
                `../../../messages/${params.locale}.json`
            );
            setT(messageData.Input);
        };

        getMessage();
    }, [params.locale]);

    useEffect(() => {
        if (date) onDateChange(date);
    }, [date, onDateChange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <fieldset className="border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2">
                    <legend className="text-sm ms-2 px-1 text-gray-400">
                        {t?.paymentDate} <span className="text-red-500">*</span>
                    </legend>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-between text-left text-base flex border-none font-medium",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? (
                                        format(date, "dd.MM.yyyy")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="mr-2 h-4 w-4" />{" "}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Select date</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </fieldset>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
