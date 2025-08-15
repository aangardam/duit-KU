/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import CoolSelect, {
    getMultiValues,
    getSingleValue,
    onMultiChange,
    onSingleChange,
} from '../ui/cool-select';
import { SelectOption } from "@/shared/interfaces/global";


interface PropTypes {
    name: string;
    label?: string;
    placeholder: string;
    control?: any;
    listData: any[];
    isRequired?: boolean;
    loading?: boolean;
    type?:"single" | "multiple";
    isDisabled?: boolean;
}

const FormSelect = (props: PropTypes) => {
    const { 
        name, 
        label,  
        placeholder, 
        control, 
        listData,
        isRequired = true,
        loading = false,
        type = "single",
        isDisabled = false,
    } = props;
    // console.log(listData)
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                let value;
                if(type === "single"){
                    value = getSingleValue(
                        listData,
                        field.value,
                        (option: any) => option.value,
                    );
                }else{
                    value = getMultiValues(
                        listData,
                        field.value,
                        (option: any) => option.value,
                    );
                }
                return (
                    <FormItem>
                        {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
                        <FormControl>
                        <CoolSelect<SelectOption, any>
                            options={listData}
                            value={value}
                            onChange={(newValues) => {
                                // console.log(newValues)
                                if(type === "single"){
                                    onSingleChange(newValues, field.onChange);
                                }else{
                                    onMultiChange(
                                        newValues,
                                        field.onChange,
                                        (option: any) => option.value,
                                    );
                                }
                            }}
                            isLoading={loading}
                            isDisabled={isDisabled}
                            placeholder={placeholder}
                            hideSelectedOptions={false}

                            isMulti={type === "multiple"}
                            closeMenuOnSelect={type === "multiple" ? false : undefined}
                            isClearable={type === "multiple" ? false : undefined}

                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                menu: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    )
}

export default FormSelect;