import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "danger";
  className?: string;
  onClick?: () => void;
}

const colors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-blue-100 text-blue-700",
  secondary: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-block text-sm font-medium px-3 py-1 rounded-full cursor-pointer ${colors[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
