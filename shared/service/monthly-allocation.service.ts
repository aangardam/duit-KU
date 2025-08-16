import { supabase } from "@/shared/lib/supabase-client";

export const getMonthlyAllocation = async (month: string, user_id: string) => {
  const { data, error } = await supabase
    .from("monthly_allocations")
    // .select("amount, category:category_id(name)")
    .select("*, budgeting:budget_id(name)")
    .eq("month", month)
    .eq("user_id", user_id);
  if (error) {
    throw error;
  }
  return data;
};