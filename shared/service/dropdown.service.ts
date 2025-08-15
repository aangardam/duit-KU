import { supabase } from "@/shared/lib/supabase-client";

//dropdown budgeting
export const getDropdownBudgeting = async () => {
    const { data, error } = await supabase
        .from('budgeting')
        .select('*')
    if (error) {
        throw error;
    }
    return data;
};

//dropdown category
export const getDropdownCategory = async () => {
    const { data, error } = await supabase
        .from('category')
        .select('*')
    if (error) {
        throw error;
    }
    return data;
};

// get dropdown category by type
export const getDropdownCategoryByType = async (type: string) => {
    const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('type', type)
    if (error) {
        throw error;
    }
    return data;
};

// get dropdown wallet 
export const getDropdownWallet = async () => {
    const { data, error } = await supabase
        .from('wallets')
        .select('*')
    if (error) {
        throw error;
    }
    return data;
};