import * as React from "react"
import { VariantProps } from "class-variance-authority"

// Import this instead of from the toast component
export type ToastActionElement = React.ReactElement

// Define the toast variants type structure
export type ToastVariants = VariantProps<(props?: any) => string> & {
  variant?: "default" | "destructive"
}

// Basic props structure
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, ToastVariants {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
} 