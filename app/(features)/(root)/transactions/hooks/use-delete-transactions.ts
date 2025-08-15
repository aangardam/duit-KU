import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "../services/transactions.service"
import { toast } from "sonner";

const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    const deleteFn = async ({ id }: { id: number }) => {
        const res = await remove(id)
        return res
    }

    const { mutate: mutateDeleteTransaction } = useMutation({
        mutationFn: deleteFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            })
            toast.success("Transaction deleted successfully")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    return {
        mutateDeleteTransaction
    }
}

export default useDeleteTransaction