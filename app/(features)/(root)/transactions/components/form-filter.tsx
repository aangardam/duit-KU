import { Form } from "@/shared/components/ui/form";
import useFilter from "../hooks/use-filter";
import AdvanceFilter from "@/shared/components/layout/advance-filter";
import FormDateRangePicker from "@/shared/components/form/form-daterangepicker";
import useDropdown from "@/shared/hooks/use-dropdown";
import FormSelect from "@/shared/components/form/form-select";
import { Dispatch, SetStateAction, useEffect } from "react";
import { TFilterTransactions } from "../interfaces/transactions";

interface PropTypes {
    // setDataFilter: React.Dispatch<React.SetStateAction<TFilterTransactions>>;
    setDataFilter: Dispatch<SetStateAction<TFilterTransactions>>;
}

const FormFilter = (props: PropTypes) => {
    // console.log(props.setDataFilter)
    const {
        form,
        handleSubmit,
        resetFilter,
        dataDropdownType,
    } = useFilter(props.setDataFilter);

    const type = form.watch('type');
    useEffect(() => {
        form.setValue("categoryId", '', { shouldValidate: true });
    }, [type, form]);

    const {
        dropdownWallet,
        isPendingWallet,
        dropdownCategoryByType,
        isPendingCategoryByType,
    } = useDropdown(type);

    // console.log(dropdownCategoryByType)
    return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <AdvanceFilter
                    resetFilter={resetFilter}
                >
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Transaction Date</label>
                            <div className="flex gap-2">
                                <FormDateRangePicker
                                    startName="startDateTransaction"
                                    endName="endDateTransaction"
                                    label=""
                                    placeholder="Search Transaction Date"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Wallet</label>
                            <div className="flex gap-2">
                                <FormSelect 
                                    name="walletId"
                                    label=""
                                    placeholder="Select Wallet"
                                    control={form.control}
                                    listData={dropdownWallet || []}
                                    loading={isPendingWallet}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Type Trancation</label>
                            <div className="flex gap-2">
                                <FormSelect 
                                    name="type"
                                    label=""
                                    placeholder="Select Type Transaction"
                                    control={form.control}
                                    listData={dataDropdownType || []}
                                    isFilter={true}
                                    
                                />
                            </div>
                        </div>

                         <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Category</label>
                            <div className="flex gap-2">
                                <FormSelect 
                                    name="categoryId"
                                    label=""
                                    placeholder="Select Category"
                                    control={form.control}
                                    listData={dropdownCategoryByType || []}
                                    loading={isPendingCategoryByType}
                                    isDisabled={form.watch('type') === ''}
                                    isFilter={true}
                                    
                                />
                            </div>
                        </div>
                        
                    </div>
                </AdvanceFilter>
            </form>
        </Form>
    );
}

export default FormFilter;