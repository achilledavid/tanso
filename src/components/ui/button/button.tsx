import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import style from "./button.module.scss"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  style.container,
  {
    variants: {
      variant: {
        default: "",
        destructive: style.destructive,
        outline: style.outline,
        secondary: style.secondary,
        ghost: style.ghost,
        link: style.link,
      },
      size: {
        sm: style.sm,
        md: style.md,
        icon: style.icon,
        iconMd: style.iconMd
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
