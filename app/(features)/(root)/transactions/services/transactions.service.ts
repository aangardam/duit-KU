import { supabase } from "@/shared/lib/supabase-client";
import { TTransactionMonthlyAllocationsPayload, TTransactionsPayload } from "../interfaces/transactions";


export const create = async (payload:TTransactionsPayload) => {
    console.log(JSON.stringify(payload))
    const { data, error } = await supabase
        .from('transactions')
        .insert([
            { 
                user_id: payload.user_id,
                wallet_id: payload.wallet_id,
                related_wallet_id: payload.related_wallet_id,
                category_id: payload.category_id,
                type: payload.type,
                name: payload.name,
                amount: payload.amount,
                date: payload.date,
                description: payload.description,
            },
        ])
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const remove = async (id:number) => {
    const { data, error } = await supabase
        .from('transactions')
        .delete()
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const update = async (payload:TTransactionsPayload) => {
    const { data, error } = await supabase
        .from('transactions')
        .update(
            {
                wallet_id: payload.wallet_id,
                related_wallet_id: payload.related_wallet_id,
                category_id: payload.category_id,
                type: payload.type,
                name: payload.name,
                amount: payload.amount,
                date: payload.date,
                description: payload.description
            })
        .match({ id: payload.id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const createMonthlyAllocations = async (payloads: TTransactionMonthlyAllocationsPayload[]) => {
  const { data, error } = await supabase
    .from('monthly_allocations')
    .insert(payloads)
    .select();

  if (error) throw error;
  return data;
};


// Hapus monthly allocations berdasarkan bulan & user
export const deleteMonthlyAllocationsByMonthAndUser = async (month: string, userId: string) => {
  const { error } = await supabase
    .from("monthly_allocations")
    .delete()
    .match({ month, user_id: userId });

  if (error) throw new Error(error.message);
};


export const findTransactionById = async (id:number) => {
    const { data, error } = await supabase
        .from('transactions')
        .select()
        .eq('id', id)
    if (error) {
        throw error;
    }
    return data;
};

export const updateMonthlyExpense = async (user: string, month: string, budget_id: number, amount: number) => {
    const { data, error } = await supabase
        .from('monthly_allocations')
        .update(
            {
                total_expense: amount,
            })
        .match({ user_id: user, month: month, budget_id: budget_id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const getMonthlyExpense = async (user: string, month: string, budget_id: number) => {
    const { data, error } = await supabase
        .from('monthly_allocations')
        .select()
        .eq('user_id', user)
        .eq('month', month)
        .eq('budget_id', budget_id)
    if (error) {
        throw error;
    }
    return data;
};

export const getTotalGaji = async (
  month: number,
  year: number,
  user_id: string
) => {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, category:category_id(name)")
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("type", "income")
    .eq("user_id", user_id)
    .eq("category.name", "Gaji");

  if (error) throw error;

  const total = data.reduce((sum, t) => sum + t.amount, 0);
  return total;
};


