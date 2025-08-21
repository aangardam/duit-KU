
import { changeDateConnectore, dateNow, startDate } from "@/shared/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { TFilterTransactions } from "../interfaces/transactions"


const Schema = z.object({
    startDateTransaction: z.any(),
    endDateTransaction: z.any(),
    categoryId: z.string().optional(),
    walletId: z.string().optional(),
    type: z.string().optional(),
})

const useFilter = (setDataFilter: Dispatch<SetStateAction<TFilterTransactions>>) => {
    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            startDateTransaction: startDate(),
            endDateTransaction: dateNow(),
            categoryId: '',
            walletId: '',
            type: '',
        },
    });

    

    const handleSubmit = (values: z.infer<typeof Schema>) => {
        // console.log(values)
        const category = values.categoryId
        const payload: TFilterTransactions = {
            startDateTransaction: changeDateConnectore(format(new Date(values.startDateTransaction), "yyyy-MM-dd")),
            endDateTransaction: changeDateConnectore(format(new Date(values.endDateTransaction), "yyyy-MM-dd")),
            categoryId: category?.split("#")[0] || "",
            walletId: values.walletId || "",
            type: values.type || "",
        }
        setDataFilter(payload)
        // console.log(payload)
        // actionWallet(payload)
    }

    const resetFilter = () => {
        form.reset()
        setDataFilter({
            startDateTransaction: changeDateConnectore(format(new Date(startDate()), "yyyy-MM-dd")),
            endDateTransaction: changeDateConnectore(format(new Date(dateNow()), "yyyy-MM-dd")),
            categoryId: "",
            type: "",
            walletId: "",
        })
    }

    const dataDropdownType = [
        { value: "expense", label: "Expense" },
        { value: "income", label: "Income" },
        { value: "transfer", label: "Transfer" },
    ];

    return {
        form,
        handleSubmit,
        resetFilter,
        dataDropdownType
    }
}   

export default useFilter