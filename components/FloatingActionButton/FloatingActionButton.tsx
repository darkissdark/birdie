"use client";
//  Кнуфлика ще треба мені
import { useState } from "react";
import styles from "./FloatingActionButton.module.css";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  ariaLabel = "Додати запис",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`${styles.fab} ${isPressed ? styles.fabPressed : ""}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      type="button"
    >
      {icon || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
