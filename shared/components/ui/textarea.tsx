import { cn } from "@/shared/lib/utils"
import * as React from "react"

// import { cn } from "@/shared/lib/utils"

export interface InputProps
    extends React.ComponentProps<"textarea"> {
    isPassword?: boolean;
    showPasswordIcon?: boolean;
    isDisabled?: boolean;
    isReadonly?: boolean;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  InputProps
>(({ className, isDisabled,isReadonly, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      disabled={isDisabled}
      readOnly={isReadonly}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
