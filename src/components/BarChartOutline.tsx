import React from "react";

type Props = {
  size?: number | string;
  color?: string;
  title?: string;
  className?: string;
};

export default function BarChartOutline({ size = 24, color = "currentColor", title = "Bar chart", className = "" }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <title>{title}</title>
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" stroke={color} strokeWidth="1.6" />
      <rect x="6.5" y="13" width="2.6" height="6" rx="0.4" stroke={color} strokeWidth="1.6" />
      <rect x="11.5" y="8" width="2.6" height="11" rx="0.4" stroke={color} strokeWidth="1.6" />
      <rect x="16.5" y="10" width="2.6" height="9" rx="0.4" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}
