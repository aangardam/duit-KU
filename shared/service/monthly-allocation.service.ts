import { supabase } from "@/shared/lib/supabase-client";
import { TTransactionMonthlyAllocationsPayload } from "../interfaces/monthly-allocation";

export const getMonthlyAllocation = async (month: string, user_id: string) => {
  const { data, error } = await supabase
    .from("monthly_allocations")
    .select("*, budgeting:budget_id(name)")
    .eq("month", month)
    .eq("user_id", user_id);
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
