"use client";

type Props = {
  variant?: "black" | "white";
  width?: number;
  className?: string;
  ariaLabel?: string;
};

export default function BrandLogo({
  variant = "black",
  width = 76,
  className,
  ariaLabel = "Leleka",
}: Props) {
  const symbolId = variant === "white" ? "logo-white" : "logo-black";
  return (
    <svg width={width} className={className} aria-label={ariaLabel}>
      <use href={`#${symbolId}`} />
    </svg>
  );
}
