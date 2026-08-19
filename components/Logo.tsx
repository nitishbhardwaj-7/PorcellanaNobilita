import React from "react";

interface LogoProps {
  variant?: "white" | "dark" | "teal";
}

export default function Logo({ variant = "white" }: LogoProps) {
  const isWhite = variant === "white";
  const isTeal = variant === "teal";
  
  const textColor = isWhite ? "text-white" : isTeal ? "text-teal-primary" : "text-brand-dark";
  const borderColor = isWhite ? "border-white" : isTeal ? "border-teal-primary" : "border-brand-dark";
  const bgLight = isWhite ? "bg-transparent" : "bg-white";

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${textColor}`}>
      <div className="font-montserrat text-[9px] tracking-[0.3em] uppercase">
        PORCELLANA
      </div>
      <div className="flex items-center space-x-1 font-cormorant font-light text-xl">
        <div className={`border px-2 py-0.5 ${borderColor} ${isWhite ? 'bg-brand-dark text-white' : 'bg-brand-dark text-white'}`}>
          NOBIL
        </div>
        <div className="bg-italian-green text-white px-2 py-0.5">I</div>
        <div className={`px-2 py-0.5 ${bgLight} ${isWhite ? 'text-white' : 'text-brand-dark'}`}>T</div>
        <div className="bg-italian-red text-white px-2 py-0.5">A</div>
      </div>
      <div className="font-montserrat text-[9px] tracking-[0.3em] uppercase whitespace-pre">
        MADE    IN    ITALY
      </div>
    </div>
  );
}
