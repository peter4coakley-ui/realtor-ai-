import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variantClasses = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-600/90',
      destructive: 'bg-red-500 text-white hover:bg-red-500/90',
      ghost: 'hover:bg-gray-700 hover:text-white',
    };

    const sizeClasses = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        icon: 'h-10 w-10',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);