export type TWallet = {
    id: number;
    rowNum?: number;
    name: string;
    type: string;
    balance: number;
}

export type TMenuResponse = TWallet