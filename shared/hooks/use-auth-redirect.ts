/* eslint-disable react-hooks/exhaustive-deps */

// import { useUserStore } from '@/shared/store/user.store';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/user.store';

export const useAuthRedirect = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { lastSignIn } = useUserStore();
   

    const originalPathname = usePathname();

    const haveToken = typeof localStorage !== 'undefined' && !!localStorage.getItem('user-storage');

    const lastSignInDate = new Date(`${lastSignIn}`);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(lastSignInDate.getTime() + oneDayInMilliseconds);
    const now = new Date();

    // console.log(haveToken);

    useEffect(() => {
        if (!haveToken) {
            redirect('/login');
        }

        if (now.getTime() > expirationDate.getTime()) {
            localStorage.removeItem('user-storage')
            redirect('/login');
        } 

        setIsLoading(false);
    }, [haveToken, originalPathname, expirationDate, now]);

    return isLoading;
};
