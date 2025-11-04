import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variantClasses = {
      default: 'bg-teal-500 text-white hover:bg-teal-600',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      ghost: 'hover:bg-gray-700 hover:text-white text-gray-300',
      outline: 'border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white',
    };

    const sizeClasses = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-12 px-6 text-base',
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