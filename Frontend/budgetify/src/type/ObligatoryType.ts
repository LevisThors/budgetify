export interface ObligatoryType {
    id?: number;
    title: string;
    description: string;
    amount: number;
    first_payment_date: Date | string;
    second_payment_date: Date | string;
    account_id?: number;
}
