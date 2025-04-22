import React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
  centered?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", centered = true, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      full: "max-w-full"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full px-4 sm:px-6",
          sizeClasses[size],
          centered && "mx-auto",
          className
        )}
        {...props}
      />
    )
  }
)

Container.displayName = "Container"

export { Container } 