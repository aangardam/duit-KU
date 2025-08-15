import { Form } from "@/shared/components/ui/form"

import useWallets from "../hooks/use-wallets"
import FormWrapper from "@/shared/components/form/form-wrapper"
import FormInput from "@/shared/components/form/form-input"
import { TWallet } from "../interfaces/wallets";
import { Button } from "@/shared/components/ui/button";
import { BsDownload, BsXLg } from "react-icons/bs";
import FormSelect from "@/shared/components/form/form-select";

interface PropTypes {
    data?: TWallet;
    onClose?: () => void;
}


const FormWallet = (props:PropTypes) => {
    const { data, onClose } = props;
    const { handleSubmit, form, dataDropdownType, isLoading } = useWallets(data, onClose)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormWrapper >
                    <FormInput 
                        name="name" 
                        label="Name"
                        placeholder="Input Name" 
                        control={form.control}
                    />

                    <FormSelect 
                        name="type"
                        label="Type"
                        placeholder="Select Parent"
                        control={form.control}
                        listData={dataDropdownType || []}
                        // isDisabled={!!data}
                        
                    />

                    <FormInput 
                        name="balance" 
                        label="Balance"
                        placeholder="Input Balance" 
                        control={form.control}
                        type="number"
                        
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

export default FormWallet