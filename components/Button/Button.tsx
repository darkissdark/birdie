import styles from "./buttons.module.css";
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "gradient";
  size?: "large" | "medium" | "small" | "extraSmall";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: boolean;
  iconOnly?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      disabled = false,
      loading = false,
      fullWidth = false,
      icon = false,
      iconOnly = false,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const getButtonClasses = (): string => {
      const classes: string[] = [styles.baseButton];

      // Варіанти кнопок
      switch (variant) {
        case "primary":
          classes.push(styles.primaryButton);
          break;
        case "secondary":
          classes.push(styles.secondaryButton);
          break;
        case "outline":
          classes.push(styles.outlineButton);
          break;
        case "gradient":
          classes.push(styles.gradientButton);
          break;
        default:
          classes.push(styles.primaryButton);
      }
      switch (size) {
        case "large":
          classes.push(styles.largeButton);
          break;
        case "medium":
          break;
        case "small":
          classes.push(styles.smallButton);
          break;
        case "extraSmall":
          classes.push(styles.extraSmallButton);
          break;
      }

      if (disabled) classes.push(styles.disabledButton);
      if (loading) classes.push(styles.loadingButton);
      if (fullWidth) classes.push(styles.fullWidthButton);
      if (icon) classes.push(styles.iconButton);
      if (iconOnly) classes.push(styles.iconOnlyButton);

      if (className) classes.push(className);

      return classes.join(" ");
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && onClick) {
        onClick(event);
      }
    };

    return (
      <button
        ref={ref}
        className={getButtonClasses()}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.loadingSpinner} aria-hidden="true">
            ⟳
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
export type { ButtonProps };
