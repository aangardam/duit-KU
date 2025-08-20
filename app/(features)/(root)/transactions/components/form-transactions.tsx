import {  Form } from "@/shared/components/ui/form"
import useTransactions from "../hooks/use-transactions"
import FormWrapper from "@/shared/components/form/form-wrapper"
import FormInput from "@/shared/components/form/form-input"
import { TTransactions } from "../interfaces/transactions";
import { Button } from "@/shared/components/ui/button";
import { BsDownload, BsXLg } from "react-icons/bs";
import FormSelect from "@/shared/components/form/form-select";
import useDropdown from "@/shared/hooks/use-dropdown";
import FormDatepickerv2 from "@/shared/components/form/form-datepickerv2";
import FormCheckbox from "@/shared/components/form/form-checkbox";

interface PropTypes {
    data?: TTransactions;
    onClose?: () => void;
}


const FormTransaction = (props:PropTypes) => {
    const { data, onClose } = props;
    const { handleSubmit, form, isLoading, dataDropdownType } = useTransactions(data, onClose)
    const {
        dropdownWallet,
        isPendingWallet,
        dropdownCategoryByType,
        isPendingCategoryByType,
    } = useDropdown(form.watch('type'));

    // console.log(form.watch('type'))
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormWrapper >
                    <FormDatepickerv2
                        name="date"
                        label="Date"
                        control={form.control}
                    />
                  
                    <FormSelect 
                        name="type"
                        label="Type"
                        placeholder="Select Parent"
                        control={form.control}
                        listData={dataDropdownType || []}
                    />

                    <FormSelect 
                        name="wallet_id"
                        label="Wallet"
                        placeholder="Select Wallet"
                        control={form.control}
                        listData={dropdownWallet || []}
                        loading={isPendingWallet}
                    />

                    {form.watch('type') === 'transfer' && (
                        <FormSelect
                            name="related_wallet_id"
                            label="Destination Wallet"
                            placeholder="Select Destination Wallet"
                            control={form.control}
                            listData={dropdownWallet || []}
                            loading={isPendingWallet}
                        />
                    )}

                    {(form.watch('type') === 'income' || form.watch('type') === 'expense') && (
                        <FormSelect 
                            name="category_id"
                            label="Category"
                            placeholder="Select Category"
                            control={form.control}
                            listData={dropdownCategoryByType || []}
                            loading={isPendingCategoryByType}
                        /> 
                    )}

                    {form.watch('type') === 'income' && (
                        <FormCheckbox 
                            name="monthly_allocations"
                            label="Use this transaction to create a monthly plan"
                            control={form.control}
                            isRequired={false}
                            description={`If checked, this income transaction will be automatically allocated to the monthly budget (Planned Expenses) and appear on the ‘Planned’ dashboard`}
                        />
                    )}
                    

                    <FormInput 
                        name="amount"
                        label="Amount"
                        placeholder="Input Amount"
                        control={form.control}
                        type="number"
                    />

                    <FormInput 
                        name="description"
                        label="Description"
                        placeholder="Input description"
                        control={form.control}
                        type="textArea"
                        isRequired={false}
                    />
                    
                    
                </FormWrapper>
                <div className="flex justify-end gap-5">
                    <Button 
                        variant="redGradient"
                        onClick={onClose}
                        type="button"
                        className="px-5 w-[130px] cursor-pointer"
                    >
                        <BsXLg className="mr-2" />
                        Cancel
                    </Button>
                    <Button 
                        variant="primaryGradient"
                        type="submit"
                        className="px-5 w-[130px] cursor-pointer"
                        isLoading={isLoading}
                    >
                        <BsDownload className="mr-2" />
                        {isLoading ? "Loading..." : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default FormTransaction