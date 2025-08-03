import * as React from "react";

export type ToastActionElement = React.ReactElement<{
  altText?: string;
  className?: string;
  children?: React.ReactNode;
}>;

export interface ToastProps {
  className?: string;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} 