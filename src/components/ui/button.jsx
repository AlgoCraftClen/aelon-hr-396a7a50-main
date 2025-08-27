import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = ({ 
  variant = "default", 
  size = "default", 
  className = "" 
} = {}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    ghost: "hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-900 dark:hover:bg-slate-700 dark:text-slate-100",
    link: "underline-offset-4 hover:underline text-slate-900 dark:text-slate-100"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return cn(baseClasses, variants[variant], sizes[size], className);
};

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  disabled = false,
  children, 
  onClick,
  type = "button",
  ...props 
}, ref) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      disabled={disabled}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };