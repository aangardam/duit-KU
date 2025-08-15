import { supabase } from "@/shared/lib/supabase-client";

export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw error;
    }
    return data;
};

export const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        throw error;
    }
    return data;
};