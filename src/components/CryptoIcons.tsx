import React from "react";

interface CryptoIconProps {
  symbol: string;
  className?: string;
}

export default function CryptoIcon({ symbol, className }: CryptoIconProps) {
  let iconPath: string;

  // Try–Catch for require()
  try {
    iconPath = require(`cryptocurrency-icons/svg/color/${symbol.toLowerCase()}.svg`);
  } catch (err) {
    // If icon missing → use fallback
    iconPath = "/assets/icons/not-found.svg";
  }

  return (
    <img
      src={iconPath}
      alt={symbol}
      className={className ? className : "w-7 h-7 rounded-full"}
      onError={(e) => {
        // If something still breaks → fallback again
        e.currentTarget.src = "/assets/icons/not-found.svg";
      }}
    />
  );
}
