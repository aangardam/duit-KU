/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

type UserState = {
    user: any;
    token: string | null;
    lastSignIn: string | null;
    setUser: (user: any) => void;
    setToken: (token: string) => void;
    setLastSignIn: (lastSignIn: string) => void;
    logout: () => void;
};

const SECRET_KEY = 'ertyuioi8765rtfgvbn';

const encrypt = (data: unknown) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY!).toString();
const decrypt = (data: string) => {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY!);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            lastSignIn: null,
            setUser: (user: unknown) => set({ user }),
            setToken: (token: string) => set({ token }),
            setLastSignIn: (lastSignIn: string) => set({ lastSignIn }),
            logout: () => {
                localStorage.removeItem('user-storage');
                
            },
        }),
        {
            name: 'user-storage',
            storage: {
                getItem: (name) => {
                    const data = localStorage.getItem(name);
                    return decrypt(data!);
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, encrypt(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
        },
    ),
);
