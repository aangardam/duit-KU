import { supabase } from "@/shared/lib/supabase-client";

// name, type, budget_id, user_id
export const create = async (name:string, type:string, budget_id:string | null, user_id:string) => {
    const { data, error } = await supabase
        .from('category')
        .insert([
            {
                name: name,
                type: type,
                budget_id: budget_id,
                user_id: user_id
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
        .from('category')
        .delete()
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const update = async (id:number, name:string, type:string, budget_id:string | null) => {
    const { data, error } = await supabase
        .from('category')
        .update({  budget_id: budget_id, type: type, name: name })
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};