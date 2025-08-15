export type TCategory = {
    id: number;
    rowNum?: number;
    name: string;
    type: string;
    budget_id: number;
    budgeting: {
        name: string;
    };
}

export type TCategoryResponse = TCategory

export type TCategoryPayload = {
    name: string;
    type: "expense" | "income";
    budget_id: string | null;
    user_id: string;
};