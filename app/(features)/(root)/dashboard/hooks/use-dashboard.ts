import { useQuery } from "@tanstack/react-query";
import { findAllWallets, getTotalBalance } from "../../master/wallets/services/wallets.service";
import { useUserStore } from "@/shared/store/user.store";
import { useMemo, useState } from "react";
import { getTotalSalary } from "../../transactions/services/transactions.service";
import { getMonthlyAllocation, getTotalMonthlyAllocation } from "@/shared/service/monthly-allocation.service";
import { generateYearRange, monthNames } from "@/shared/lib/utils";

const useDashboard = () => {
    const { user } = useUserStore();
    const currentDate = useMemo(() => new Date(), [])
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
    const years = useMemo(() => generateYearRange(currentDate.getFullYear()), [currentDate])

    // total balance
    const { data: totalBalance, isPending: isPendingTotalBalance } = useQuery({
        queryKey: ['total-balance', user],
        queryFn: () => getTotalBalance(user),
        enabled: !!user
    });

    // find all wallets
    const { data: dataWallets, isPending: isPendingWallets } = useQuery({
        queryKey: ['wallets', user],
        queryFn: () => findAllWallets(user),
        enabled: !!user
    });    


    // total gaji
    const { data: totalSalary} = useQuery({
        queryKey: ["total-salary", user, selectedMonth, selectedYear],
        // queryFn: () => getTotalSalary(selectedMonth + 1, selectedYear, user),
        queryFn:() => getTotalMonthlyAllocation(selectedMonth + 1, selectedYear, user),
        enabled: !!user
    });

    // get allocation
    const month = `${selectedYear}/${String(selectedMonth+1).padStart(2, "0")}`;
    const { data: allocation } = useQuery({
        queryKey: ["allocation", user, selectedMonth, selectedYear],
        queryFn: () => getMonthlyAllocation(month, user),
        enabled: !!user
    });

 
    return {
        totalBalance,
        isPendingTotalBalance,
        dataWallets,
        isPendingWallets,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        monthNames,
        years,
        totalSalary,
        allocation,
    }
}   

export default useDashboard