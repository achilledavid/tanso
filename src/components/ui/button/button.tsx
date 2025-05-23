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
        primary: "",
        secondary: style.secondary,
        tertiary: style.tertiary,
        outline: style.outline,
        ghost: style.ghost,
        destructive: style.destructive,
        link: style.link,
        aside: style.aside,
      },
      size: {
        sm: style.sm,
        md: style.md,
        lg: style.lg,
        xl: style.xl,
        icon: style.icon,
        iconMd: style.iconMd,
        iconLg: style.iconLg,
        iconXl: style.iconXl,
        asideSize: style.asideSize,
      },
    },
    defaultVariants: {
      variant: "primary",
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
