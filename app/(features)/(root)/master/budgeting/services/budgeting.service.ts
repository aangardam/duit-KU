import { supabase } from "@/shared/lib/supabase-client";


export const getBudgetingByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('budgeting')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};


export const create = async (name: string, percentage: string, user_id:string) => {
    const { data, error } = await supabase
        .from('budgeting')
        .insert([
            { name: name, percentage: percentage, user_id: user_id },
        ])
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const deleteBudgeting = async (id:number) => {
    const { data, error } = await supabase
        .from('budgeting')
        .delete()
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const updateBudgeting = async (id:number, name:string, percentage:string) => {
    const { data, error } = await supabase
        .from('budgeting')
        .update({ name: name, percentage: percentage })
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

