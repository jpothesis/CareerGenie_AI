// src/components/Card.tsx
import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl bg-neutral-900 shadow-md ${className}`}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-4 ${className}`} {...props} />
  )
);
CardContent.displayName = "CardContent";
