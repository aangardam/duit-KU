/* eslint-disable @typescript-eslint/no-explicit-any */

import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import InputDatePicker from "../ui/date-picker";


type PropTypes = {
  name: string;
  label?: string;
  control?: any;
  isRequired?: boolean;
};

const FormDatepicker = ({ name, control, isRequired, label }: PropTypes) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
                    <FormControl>
                        <div className="relative w-full">
                            <InputDatePicker
                                value={field.value || ''}
                                onChange={(date: any) =>
                                    field.onChange(date?.isValid ? date : '')
                                }
                                containerStyle={{ width: '100%' }}
                                className="pr-10 w-full"
                            />
                            <CalendarIcon className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormDatepicker;
