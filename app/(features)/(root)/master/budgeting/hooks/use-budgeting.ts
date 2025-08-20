/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { create, updateBudgeting, getBudgetingByUser } from "../services/budgeting.service"
import { toast } from "sonner"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/shared/store/user.store"

const schema = z.object({
  name: z.string(),
  percentage: z.string(),
})

const useBudgeting = (data?: any, onClose?: () => void) => {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const { user } = useUserStore()

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: data?.name ?? "",
      percentage: data?.percentage ?? "",
    },
    resolver: zodResolver(schema),
  })

  const IdBudgeting = data?.id ?? 0

  const handleSubmit = (formData: z.infer<typeof schema>) => {
    setIsLoading(true)
    actionBudgeting({
      name: formData.name,
      percentage: formData.percentage,
      user_id: user,
    })
    if (onClose) onClose()
  }

  const action = async ({
    name,
    percentage,
    user_id,
  }: {
    name: string
    percentage: string
    user_id: string
  }) => {
    // === Cek total percentage dulu ===
    const budgetings = await getBudgetingByUser(user_id)
    const newPercentage = Number(percentage)

    let total = budgetings.reduce((sum, b) => sum + Number(b.percentage), 0)

    if (IdBudgeting !== 0) {
      // kalau update, kurangi dulu percentage lama
      const old = budgetings.find((b) => b.id === IdBudgeting)
      if (old) {
        total -= Number(old.percentage)
      }
    }

    if (total + newPercentage > 100) {
        
        const remaining = 100 - total 

        throw new Error(
            `The total percentage must not exceed 100%. Remaining percentage allowed: ${remaining}%`
        );
    }

    // if (total + newPercentage > 100) {
    //   throw new Error("The total percentage must not exceed 100%, and only the remaining, ", total - newPercentage )
    // }

    // === Create / Update ===
    if (IdBudgeting !== 0) {
      return updateBudgeting(IdBudgeting, name, percentage)
    } else {
      return create(name, percentage, user_id)
    }
  }

  const { mutate: actionBudgeting } = useMutation({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgeting"] })
      toast.success(IdBudgeting !== 0 ? "Budgeting updated successfully" : "Budgeting created successfully")
      setIsLoading(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
      setIsLoading(false)
    },
  })

  return {
    handleSubmit,
    form,
    isLoading,
  }
}

export default useBudgeting
