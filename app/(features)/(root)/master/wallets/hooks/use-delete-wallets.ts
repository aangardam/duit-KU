import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWallet } from "../services/wallets.service"
import { toast } from "sonner";

const useDeleteWallets = () => {
    const queryClient = useQueryClient();

    const deleteFn = async ({ id }: { id: number }) => {
        const res = await deleteWallet(id)
        return res
    }

    const { mutate: mutateDeleteWallet } = useMutation({
        mutationFn: deleteFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["wallets"],
            })
            toast.success("Wallet deleted successfully")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    return {
        mutateDeleteWallet
    }
}

export default useDeleteWallets