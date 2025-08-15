import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { remove } from "../services/category.service";

const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    const deleteFn = async ({ id }: { id: number }) => {
        const res = await remove(id)
        return res
    }

    const { mutate: mutateDeleteCategory } = useMutation({
        mutationFn: deleteFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["category"],
            })
            toast.success("Category deleted successfully")
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        },
    })

    return {
        mutateDeleteCategory
    }
}

export default useDeleteCategory