
import React from 'react';

export const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-gray-600 text-gray-200 ${className}`}
    {...props}
  />
));
