
import React, { forwardRef, HTMLAttributes } from 'react';

export const ScrollArea = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>> (
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`relative overflow-y-auto ${className}`}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4f46e5 #1f2937',
                }}
                {...props}
            >
                {children}
                <style>{`
                    .dark ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    .dark ::-webkit-scrollbar-track {
                        background: #1f2937;
                        border-radius: 10px;
                    }
                    .dark ::-webkit-scrollbar-thumb {
                        background-color: #4f46e5;
                        border-radius: 10px;
                        border: 2px solid #1f2937;
                    }
                `}</style>
            </div>
        );
    }
);
