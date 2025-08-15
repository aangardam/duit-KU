/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from "react-hook-form";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormItem, FormLabel, FormMessage, FormControl } from "../ui/form";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Props = {
  startName: string;
  endName: string;
  label?: string;
  placeholder?: string;
};

const FormDateRangePicker = ({ startName, endName, label, placeholder }: Props) => {
  const { setValue, watch } = useFormContext();

  const startDate = watch(startName);
  const endDate = watch(endName);

  const handleChange = (range: any) => {
    const { startDate, endDate } = range.selection;
    setValue(startName, startDate);
    setValue(endName, endDate);
  };

  return (
    <FormItem className="w-full">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate && endDate ? (
                <>
                  {format(startDate, "yyyy/MM/dd")} - {format(endDate, "yyyy/MM/dd")}
                </>
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <DateRange
              ranges={[
                {
                  startDate: startDate || new Date(),
                  endDate: endDate || new Date(),
                  key: "selection",
                },
              ]}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              editableDateInputs
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormDateRangePicker;
