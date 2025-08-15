/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { create, updateWallet } from "../services/wallets.service"
import { toast } from "sonner"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/shared/store/user.store"

const schema = z.object({
    name: z.string(),
    type: z.string(),
    balance: z.string(),
})


const useWallets = (data?: any, onClose?: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUserStore();
    console.log(user)

    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            name: data?.name ?? "",
            type: data?.type ?? "",
            balance: data?.balance ?? "",
        },
        resolver: zodResolver(schema),
    });

    let IdWallet:number = 0;
    if (data) {
        IdWallet = data.id;
    }

    const handleSubmit = (data: z.infer<typeof schema>) => {
        setIsLoading(true);
        actionWallet({ name: data.name, type: data.type, balance: data.balance, user_id: user })
        if (onClose) onClose();
    };

    const action = async ({ name, type, balance, user_id }: { name: string, type: string, balance: string, user_id:string }) => { 
        let res;
        if (IdWallet != 0) { 
            res = await updateWallet(IdWallet, name, type, balance)
        } else {
            res = await create(name, type, balance, user_id)
        }
        
        return res
    }
    
    const { mutate: actionWallet } = useMutation({
        mutationFn: action,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["wallets"],
            })
            let message = 'Wallet created successfully';
            if (IdWallet != 0) {
                message = 'Wallet updated successfully';
            }
            setIsLoading(false);
            toast.success(message)
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    const dataDropdownType = [
        { value: 'Bank', label: "Bank" },
        { value: "Cash", label: "Cash" },
        { value: "E-Wallets", label: "E-Wallets" },
    ]

    return {
        handleSubmit,
        form,
        dataDropdownType,
        isLoading
    }
}

export default useWallets