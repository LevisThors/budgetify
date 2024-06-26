import { CategoryType } from "./CategoryType";

export interface TransactionType {
    id?: string | number;
    title: string;
    description: string;
    amount: string | number;
    type: "Income" | "Expenses";
    payment_date: Date | string;
    payee: string;
    categories: CategoryType[];
    media?: File[] | undefined;
    documents?: {
        path: string;
        name: string;
        url: string;
    }[];
    [key: string]:
        | string
        | number
        | null
        | CategoryType[]
        | File[]
        | Date
        | { path: string; name: string; url: string }[]
        | undefined;
}
