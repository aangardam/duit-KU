import { supabase } from "@/shared/lib/supabase-client";


export const create = async (name: string, type: string, balance: string, user_id:string) => {
    const { data, error } = await supabase
        .from('wallets')
        .insert([
            { name: name, type: type, balance: balance, user_id: user_id },
        ])
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const deleteWallet = async (id:number) => {
    const { data, error } = await supabase
        .from('wallets')
        .delete()
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const updateWallet = async (id:number, name:string, type:string, balance:string) => {
    const { data, error } = await supabase
        .from('wallets')
        .update({ name: name, type: type, balance: balance })
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const updateBalance = async (id:number, balance:string) => {
    const { data, error } = await supabase
        .from('wallets')
        .update({ balance: balance })
        .match({ id: id })
        .select()
    if (error) {
        throw error;
    }
    return data;
};

export const getWalletByid = async (wallet_id:string) => {
    const { data, error } = await supabase
        .from('wallets')
        .select()
        .eq('id', wallet_id)
    if (error) {
        throw error;
    }
    return data;
};

export const findAllWallets = async () => {
    const { data, error } = await supabase
        .from('wallets')
        .select()
    if (error) {
        throw error;
    }
    return data;
};

