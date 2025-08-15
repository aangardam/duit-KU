/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { create, updateBudgeting } from "../services/budgeting.service"
import { toast } from "sonner"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/shared/store/user.store"

const schema = z.object({
    name: z.string(),
    percentage: z.string(),
})


const useBudgeting = (data?: any, onClose?: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUserStore();

    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            name: data?.name ?? "",
            percentage: data?.percentage ?? "",
        },
        resolver: zodResolver(schema),
    });

    let IdBudgeting:number = 0;
    if (data) {
        IdBudgeting = data.id;
    }

    const handleSubmit = (data: z.infer<typeof schema>) => {
        setIsLoading(true);
        actionBudgeting({ name: data.name, percentage: data.percentage, user_id: user })
        if (onClose) onClose();
    };

    const action = async ({ name, percentage, user_id }: { name: string,  percentage: string, user_id:string }) => { 
        let res;
        if (IdBudgeting != 0) { 
            res = await updateBudgeting(IdBudgeting, name, percentage)
        } else {
            res = await create(name, percentage, user_id)
        }
        
        return res
    }
    
    const { mutate: actionBudgeting } = useMutation({
        mutationFn: action,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["budgeting"],
            })
            let message = 'Budgeting created successfully';
            if (IdBudgeting != 0) {
                message = 'Budgeting updated successfully';
            }
            setIsLoading(false);
            toast.success(message)
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    return {
        handleSubmit,
        form,
        isLoading
    }
}

export default useBudgeting