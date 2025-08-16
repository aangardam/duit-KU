export type TTransactionMonthlyAllocationsPayload = {
    user_id: string;
    budget_id: number;
    month: string;
    percentage: string;
    amount: string;
}