export interface PiggyBankType {
    id?: string | number;
    goal: string;
    goal_amount: number;
    saved_amount: number;
    date: Date;
    account_id?: string | number;
    updated_at?: Date;
    currency?: string;
}
