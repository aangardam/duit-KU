'use client'

import { useState } from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export default function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    staleTime: 60 * 1000,
                    retry: false,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}