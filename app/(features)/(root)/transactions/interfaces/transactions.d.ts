export type TTransactions = {
    id: number;
    rowNum?: number;
    wallets: {
        name: string;
    },
    category: {
        name: string;
    }
    type: string;
    name: string;
    amount: string;
    date: string;
    description: string;
   
}

export type TTransactionsResponse = TTransactions

export type TTransactionsPayload = {
    id?: number;
    user_id?: string;
    wallet_id: string | null | undefined;
    related_wallet_id: string | null | undefined;
    category_id: string | null | undefined;
    type: "income" | "expense" | "transfer";
    name: string;
    amount: string;
    date: string;
    description: string;
    monthly_allocations?: boolean;
};

export type TTransactionMonthlyAllocationsPayload = {
    user_id: string;
    budget_id: number;
    month: string;
    percentage: string;
    amount: string;
}