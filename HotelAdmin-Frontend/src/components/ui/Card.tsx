import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-slate-800 dark:bg-slate-900 rounded-lg p-6 border border-slate-700 dark:border-slate-800 shadow-lg ${hover ? 'hover:border-indigo-500 hover:shadow-xl transition-all duration-200' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
