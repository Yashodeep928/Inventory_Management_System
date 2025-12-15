import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "font-bold rounded-[16px] transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500";
  
  const variantClasses = {
    primary: "text-white bg-[linear-gradient(180deg,#075339_0%,_#10b981_100%)] shadow-[0px_8px_21px_#00000028] hover:shadow-[0px_12px_25px_#00000035]",
    secondary: "text-[#1c1c1c] bg-[#e8ffd7] hover:bg-[#d4f7c5]",
    danger: "text-white bg-red-600 hover:bg-red-700",
    outline: "text-[#075339] bg-transparent border-2 border-[#075339] hover:bg-[#075339] hover:text-white"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
