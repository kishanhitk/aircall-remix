import clsx from "clsx";
import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}
const Button = ({ children, disabled, isLoading }: ButtonProps) => {
  return (
    <button
      className={clsx(
        "bg-gray-900 text-white rounded-md py-2 px-5 hover:bg-gray-800 hover:shadow-md transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        isLoading ? "opacity-50 cursor-wait" : ""
      )}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  );
};

export default Button;
