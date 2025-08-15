/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getDropdownBudgeting, getDropdownCategory, getDropdownCategoryByType, getDropdownWallet } from "../service/dropdown.service";
import { useEffect, useState } from "react";

const useDropdown = (type?: string) => {
    //dropdown budgeting
    const { data: dropdownBudgeting, isPending: isPendingBudgeting } = useQuery({
        queryKey: ['dropdown-budgeting'],
        queryFn: () => getDropdownBudgeting(),
        select: ( data ) => data.map((item) => ({ value: `${item.id}`, label: item.name })),
    });

    //dropdown category
    const { data: dropdownCategory, isPending: isPendingCategory } = useQuery({
        queryKey: ['dropdown-category'],
        queryFn: () => getDropdownCategory(),
        select: ( data ) => data.map((item) => ({ value: `${item.id}`, label: item.name })),
        
    });

    // dropdown category by type
    const typeParam = type ?? "";
   const [dropdownCategoryByType, setDropdownCategoryByType] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (!typeParam) return;

        const fetchData = async () => {
            try {
                const data = await getDropdownCategoryByType(typeParam);
                console.log(data);

                // Kalau mau format untuk dropdown
                const format = data.map((item: any) => ({
                    value: `${item.id}#${item.name}`,
                    label: item.name
                }));
                setDropdownCategoryByType(format);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, [typeParam]);

    // const { data: tmpdropdownCategoryByType, isPending: isPendingCategoryByType } = useQuery({
    //     queryKey: ['dropdown-category-by-type'],
    //     queryFn: () => getDropdownCategoryByType(typeParam),
    //     select: ( data ) => data.map((item) => ({ value: item.id, label: item.name })),
    // });

    //dropdown wallet
    const { data: dropdownWallet, isPending: isPendingWallet } = useQuery({
        queryKey: ['dropdown-wallet'],
        queryFn: () => getDropdownWallet(),
        select: ( data ) => data.map((item) => ({ value: `${item.id}`, label: item.name })),
    });

    const isPendingCategoryByType = false;
    return {
        dropdownBudgeting,
        isPendingBudgeting,
        dropdownCategory,
        isPendingCategory,
        dropdownCategoryByType,
        isPendingCategoryByType,
        dropdownWallet,
        isPendingWallet,
        
    };
};

export default useDropdown;