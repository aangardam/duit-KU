import { Form } from "@/shared/components/ui/form"
import FormWrapper from "@/shared/components/form/form-wrapper"
import FormInput from "@/shared/components/form/form-input"
import { TBudgeting } from "../interfaces/budgeting";
import { Button } from "@/shared/components/ui/button";
import { BsDownload, BsXLg } from "react-icons/bs";
import useBudgeting from "../hooks/use-budgeting";

interface PropTypes {
    data?: TBudgeting;
    onClose?: () => void;
}


const FormBudgeting = (props:PropTypes) => {
    const { data, onClose } = props;
    const { handleSubmit, form, isLoading } = useBudgeting(data, onClose)
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

                    <FormInput 
                        name="percentage" 
                        label="Percentage"
                        placeholder="Input Percentage" 
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

export default FormBudgeting