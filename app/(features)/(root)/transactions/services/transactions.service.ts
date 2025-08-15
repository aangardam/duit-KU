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

