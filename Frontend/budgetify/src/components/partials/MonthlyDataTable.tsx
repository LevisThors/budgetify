import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import currencyToSymbol from "@/util/currencyToSymbol";

export function MonthlyDataTable({
    monthlyStatistics,
    headerTranslations,
    currency,
}: {
    monthlyStatistics: Record<string, number>[];
    currency: string;
    headerTranslations: any;
}) {
    return (
        <Table className="rounded-lg bg-white overflow-hidden">
            <TableHeader className="bg-[#D5F1EC] text-base">
                <TableRow>
                    <TableHead className="w-[150px] h-fit py-1">
                        {headerTranslations.month}
                    </TableHead>
                    <TableHead className="h-fit py-1">
                        {headerTranslations.income}
                    </TableHead>
                    <TableHead className="h-fit py-1">
                        {headerTranslations.expenses}
                    </TableHead>
                    <TableHead className="h-fit py-1">
                        {headerTranslations.economy}
                    </TableHead>
                    <TableHead className="h-fit py-1">
                        {headerTranslations.economyPerc}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {monthlyStatistics.map((statistic: any) => (
                    <TableRow key={statistic.month}>
                        <TableCell className="font-medium h-fit py-1">
                            {statistic.month}
                        </TableCell>
                        <TableCell className="h-fit py-1">
                            {statistic.income}
                            {currencyToSymbol(currency)}
                        </TableCell>
                        <TableCell className="h-fit py-1">
                            {statistic.expenses}
                            {currencyToSymbol(currency)}
                        </TableCell>
                        <TableCell
                            className={`h-fit py-1 ${
                                statistic.income >= statistic.expenses
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {statistic.income >= statistic.expenses ? "" : "-"}
                            {statistic.economy}
                            {currencyToSymbol(currency)}
                        </TableCell>
                        <TableCell
                            className={`h-fit py-1 ${
                                statistic.income >= statistic.expenses
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {statistic.income >= statistic.expenses ? "" : "-"}
                            {statistic.percentage_of_economy}%
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
