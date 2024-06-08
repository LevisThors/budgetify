import { CategoryType } from "./CategoryType";

export interface SubscriptionType {
    id?: number;
    title: string;
    description: string;
    amount: number;
    first_payment_date: Date | string;
    second_payment_date?: Date | undefined | string;
    account_id?: number;
    categories: CategoryType[];
}
