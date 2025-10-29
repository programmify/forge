import React from "react";

interface ForgeLogoProps {
  className?: string;
}

export const ForgeLogo: React.FC<ForgeLogoProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
      aria-hidden="true"
    >
      {/* Interlocked chevrons inspired by provided mark */}
      <path
        d="M18 34l16-16 30 30-16 16-14-14-16 16-16-16 16-16z"
        fill="#1e40af"
      />
      <path
        d="M110 94l-16 16-30-30 16-16 14 14 16-16 16 16-16 16z"
        fill="#60a5fa"
      />
    </svg>
  );
};

export default ForgeLogo;


