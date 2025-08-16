import { useQuery } from "@tanstack/react-query";
import { findAllWallets, getTotalBalance } from "../../master/wallets/services/wallets.service";
import { useUserStore } from "@/shared/store/user.store";
import { useState } from "react";
import { getTotalSalary } from "../../transactions/services/transactions.service";
import { getMonthlyAllocation } from "@/shared/service/monthly-allocation.service";



const useDashboard = () => {
    const { user } = useUserStore();
    const currentDate = new Date()
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

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


    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]

    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i)

    // total gaji
    // console.log(user)
    const { data: totalSalary} = useQuery({
        queryKey: ["total-salary", user, selectedMonth, selectedYear],
        queryFn: () => getTotalSalary(selectedMonth + 1, selectedYear, user),
        enabled: !!user
    });

    // get allocation
    // `${year}-${String(month).padStart(2, "0")}-01`
    const month = `${selectedYear}/${String(selectedMonth+1).padStart(2, "0")}`;
    const { data: allocation } = useQuery({
        queryKey: ["allocation", user, selectedMonth, selectedYear],
        queryFn: () => getMonthlyAllocation(month, user),
        enabled: !!user
    });

    console.log(allocation)
 
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