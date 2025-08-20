/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type PropTypes = {
  name: string;
  label?: string;
  control?: any;
  isRequired?: boolean;
  description?: React.ReactNode;
};

const FormCheckbox = ({ name, label, control,  isRequired = true, description, }: PropTypes) => {

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4">
            {/* {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>} */}
            <FormControl>
                <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            </FormControl>
            <div className="space-y-1 leading-none">
                {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
                <FormDescription>
                    {description}
                </FormDescription>
            </div>
            <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;
