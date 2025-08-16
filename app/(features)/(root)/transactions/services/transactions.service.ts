import { supabase } from "@/shared/lib/supabase-client";
import { TTransactionsPayload } from "../interfaces/transactions";


export const create = async (payload:TTransactionsPayload) => {
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

export const getTotalSalary = async (
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


