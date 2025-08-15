import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    isPassword?: boolean;
    showPasswordIcon?: boolean;
    isDisabled?: boolean;
    isReadonly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            isPassword,
            showPasswordIcon,
            isDisabled,
            isReadonly,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const inputType = isPassword
            ? showPassword
                ? 'text'
                : 'password'
            : type || 'text';
        return (
            <div className="relative">
                <input
                    ref={ref}
                    type={isPassword ? inputType : type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    disabled={isDisabled}
                    readOnly={isReadonly}
                    autoComplete="off"
                    {...props}
                />
                {isPassword && showPasswordIcon && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-2 flex items-center focus:outline-none"
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
