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
import { CategoryType } from "@/type/CategoryType";
import currencyToSymbol from "@/util/currencyToSymbol";

export function DataTable({
    categoryStatistics,
    currency,
}: {
    categoryStatistics: Record<string, number>;
    currency: string;
}) {
    const totalSpent = Object.entries(categoryStatistics).reduce(
        (acc, [_, value]: any) => {
            return acc + value;
        },
        0
    );

    return (
        <Table className="rounded-lg bg-white overflow-hidden">
            <TableHeader className="bg-[#D5F1EC] text-base">
                <TableRow>
                    <TableHead className="w-[100px] h-fit py-1">
                        Category
                    </TableHead>
                    <TableHead className="h-fit py-1">Amount</TableHead>
                    <TableHead className="h-fit py-1">% in total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(categoryStatistics).map(([key, value]: any) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium h-fit py-1">
                            {key}
                        </TableCell>
                        <TableCell className="h-fit py-1">
                            {value} {currencyToSymbol(currency)}
                        </TableCell>
                        <TableCell className="h-fit py-1">
                            {((value / totalSpent) * 100).toFixed(2)}%
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
