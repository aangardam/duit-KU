/* eslint-disable @typescript-eslint/no-explicit-any */

import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";


type PropTypes = {
  name: string;
  label?: string;
  control?: any;
  isRequired?: boolean;
};

const FormDatepickerv2 = ({ name, control, isRequired, label }: PropTypes) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                                format(field.value, "yyyy/MM/dd")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormDatepickerv2;
