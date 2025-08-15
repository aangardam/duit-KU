import { Form } from "@/shared/components/ui/form"

import useWallets from "../hooks/use-category"
import FormWrapper from "@/shared/components/form/form-wrapper"
import FormInput from "@/shared/components/form/form-input"
import { TCategory } from "../interfaces/category";
import { Button } from "@/shared/components/ui/button";
import { BsDownload, BsXLg } from "react-icons/bs";
import FormSelect from "@/shared/components/form/form-select";
import useDropdown from "@/shared/hooks/use-dropdown";

interface PropTypes {
    data?: TCategory;
    onClose?: () => void;
}


const FormCategory = (props:PropTypes) => {
    const { data, onClose } = props;
    const { handleSubmit, form, dataDropdownType, isLoading } = useWallets(data, onClose)
    const {
        dropdownBudgeting,
        isPendingBudgeting,
    } = useDropdown();

    // console.log(form.watch('type'))
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                
                <FormWrapper >

                    <FormSelect 
                        name="type"
                        label="Type"
                        placeholder="Select Parent"
                        control={form.control}
                        listData={dataDropdownType || []}
                        // isDisabled={!!data}
                        
                    />
                    
                    {form.watch('type') === 'expense' && (
                        <FormSelect 
                            name="budget_id"
                            label="Budget"
                            placeholder="Select Budgeting"
                            control={form.control}
                            listData={dropdownBudgeting || []}
                            loading={isPendingBudgeting}
                            // isDisabled={!!data}
                            
                        />
                    ) }
                    

                    <FormInput 
                        name="name" 
                        label="Name"
                        placeholder="Input Name" 
                        control={form.control}
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

export default FormCategory