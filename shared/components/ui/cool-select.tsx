/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import { Check, XIcon } from 'lucide-react';
import Select, {
    ClearIndicatorProps,
    GroupBase,
    MultiValue,
    MultiValueRemoveProps,
    Props,
    components,
} from 'react-select';

interface CoolSelectProps<
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {}

export default function CoolSelect<
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({ options = [], ...props }: CoolSelectProps<Option, IsMulti, Group>) {
    return (
        <Select
            {...props}
            options={options}
            components={{
                ClearIndicator: CustomClearIndicator,
                MultiValueRemove: CustomMultiValueRemove,
                Option: ({ children, ...props }) => (
                    <components.Option {...props}>
                        <div className="flex items-center">
                            {children}
                            <Check
                                size={18}
                                className={clsx('ml-auto font-bold', {
                                    hidden: !props.isSelected,
                                    'text-slate-500': props.isSelected,
                                    'text-transparent': !props.isSelected,
                                })}
                            />
                        </div>
                    </components.Option>
                ),
            }}
            styles={{
                control: (base, state) => ({
                    ...base,
                    fontSize: '0.875rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    backgroundColor: state.isDisabled
                        ? '#F9FAFB'
                        : 'bg-primary', // Light grey when disabled
                    cursor: state.isDisabled ? 'not-allowed' : 'pointer', // Disabled cursor
                    '&:hover': {
                        border: '1px solid #E5E7EB',
                    },
                }),
                singleValue: (base, state) => ({
                    ...base,
                    color: state.isDisabled
                        ? '#9CA3AF'
                        : 'text-muted-foreground', // Muted color when disabled
                    fontSize: '0.875rem',
                }),
                multiValue: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                    color: state.isFocused ? '#111827' : '#4B5563',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#F3F4F6',
                    },
                    fontSize: '0.875rem',
                }),
                menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                }),
                menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                }),
            }}
        />
    );
}

const CustomClearIndicator = <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: ClearIndicatorProps<Option, IsMulti, Group>,
) => {
    return (
        <div {...props.innerProps}>
            <XIcon size={16} className="mr-2 text-slate-500 cursor-pointer" />
        </div>
    );
};

const CustomMultiValueRemove = <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: MultiValueRemoveProps<Option, IsMulti, Group>,
) => {
    //@ts-ignore
    const { roleIdDisable } = props?.data;
    return (
        <div
            {...props.innerProps}
            className="flex justify-items-center items-center mr-1"
        >
            <XIcon
                onClick={(e: any) => {
                    if (roleIdDisable) {
                        e.stopPropagation();
                    } else {
                        props.innerProps.onClick?.(e);
                    }
                }}
                size={16}
                className={clsx('text-slate-500 hover:text-red-500', {
                    'cursor-not-allowed': roleIdDisable,
                })}
            />
        </div>
    );
};

export function getMultiValues<Option, V>(
    options: MultiValue<Option> = [],
    value: V[],
    getOptionValue: (option: Option) => V,
) {
    if (!value) return null;
    return options.filter((option) => value.includes(getOptionValue(option)));
}

export function getSingleValue<Option, V>(
    options: any = [],
    value: V,
    getOptionValue: (option: Option) => V,
): Option | undefined {
    if (options.some((option: any) => 'options' in option)) {
        // If there are groups, flatten the options
        const flattenedOptions = options.flatMap((option: any) =>
            'options' in option ? option.options : [option],
        );
        return flattenedOptions.find(
            (option: any) => getOptionValue(option) === value,
        );
    } else {
        // If there are no groups, directly search through options
        return options.find((option: any) => getOptionValue(option) === value);
    }
}

export function onMultiChange<Option>(
    values: MultiValue<Option>,
    onChange: (value: any[]) => void,
    getOptionValue: (option: Option) => Option,
) {
    // Find the "All Role" option
    const allRoleOption = values.find(
        (option: any) => option.label === 'All Role',
    );
    let newValues;

    if (allRoleOption) {
        // If "All Role" is selected, set the value to only "All Role"
        newValues = [allRoleOption];
    } else {
        // Otherwise, set the value to the selected options excluding "All Role"
        newValues = values.filter((option: any) => option.label !== 'All Role');
    }

    onChange(newValues.map((option) => getOptionValue(option)));
}

export function onSingleChange(value: any, onChange: (value: any) => void) {
    onChange(value?.value);
}
export function onSingleChangeDynamic(
    value: any,
    onChange: (value: any) => void,
) {
    if (!value || !value.value) return null;
    onChange({ code: value.value });
}
