import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerClassName = "",
  className = "",
  ...props
}) => {
  const baseClasses = "w-full pt-[14px] pr-[14px] pb-[14px] text-[12px] font-normal leading-[15px] text-left text-[#1c1c1c] rounded-[16px] border-0 focus:outline-none focus:ring-2 focus:ring-green-500";
  
  const backgroundClasses = error ? "bg-red-50 border-red-300" : "bg-[#e8ffd7cc]";
  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  const iconPadding = icon ? "pl-[44px]" : "pl-[14px]";

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-[#1c1c1c]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-[14px] w-[24px] h-[24px] z-10">
            {icon}
          </div>
        )}
        <input
          className={`${baseClasses} ${backgroundClasses} ${disabledClasses} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
