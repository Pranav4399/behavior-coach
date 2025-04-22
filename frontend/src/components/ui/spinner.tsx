import React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
}

const Spinner = ({
  className,
  size = "md",
  variant = "primary",
  ...props
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3"
  }

  const variantClasses = {
    default: "border-background border-t-foreground",
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Spinner } 