import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudgeting } from "../services/budgeting.service"
import { toast } from "sonner";

const useDeleteBudgeting = () => {
    const queryClient = useQueryClient();

    const deleteFn = async ({ id }: { id: number }) => {
        const res = await deleteBudgeting(id)
        return res
    }

    const { mutate: mutateDeletBudgeting } = useMutation({
        mutationFn: deleteFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["budgeting"],
            })
            toast.success("Budgeting deleted successfully")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    return {
        mutateDeletBudgeting
    }
}

export default useDeleteBudgeting