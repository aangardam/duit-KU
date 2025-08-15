/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { create, update } from "../services/category.service"
import { toast } from "sonner"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/shared/store/user.store"
import { TCategoryPayload } from "../interfaces/category"

const schema = z.object({
    budget_id: z.any().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    type: z.enum(["expense", "income"]),
}).refine(
    (data) => data.type === "income" || !!data.budget_id,
    {
        message: "Budget is required for Expense type",
        path: ["budget_id"],
    }
);


const useCategory = (data?: any, onClose?: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUserStore();

    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            name: data?.name ?? "",
            type: data?.type ?? "",
            budget_id: data?.budget_id ?? "",
        },
        resolver: zodResolver(schema),
    });

    let IdCategory:number = 0;
    if (data) {
        IdCategory = data.id;
    }

    const handleSubmit = (data: z.infer<typeof schema>) => {
        setIsLoading(true);
        const payload = {
            name: data.name,
            type: data.type,
            budget_id: data.type === "income" ? null : `${data.budget_id}` || null,
            user_id: user
        }

        console.log(payload)
        actionCategory(payload)
        if (onClose) onClose();
    };

    const action = async ({ name, type, budget_id, user_id }: TCategoryPayload) => {
        let res;
        if (IdCategory != 0) { 
            res = await update(IdCategory, name, type, budget_id)
        } else {
            res = await create(name, type, budget_id, user_id)
        }
        
        return res
    }
    
    const { mutate: actionCategory } = useMutation({
        mutationFn: action,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["category"],
            })
            let message = 'Category created successfully';
            if (IdCategory != 0) {
                message = 'Category updated successfully';
            }
            setIsLoading(false);
            toast.success(message)
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    const dataDropdownType = [
        { value: 'expense', label: "Expense" },
        { value: "income", label: "Income" },
    ]

    return {
        handleSubmit,
        form,
        dataDropdownType,
        isLoading
    }
}

export default useCategory