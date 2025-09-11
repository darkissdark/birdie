import styles from "./buttons.module.css";
import { forwardRef } from "react";

const Button = forwardRef(
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
    const getButtonClasses = () => {
      let classes = [styles.baseButton];

      // Варінти кнопок

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

    return (
      <button
        ref={ref}
        className={getButtonClasses()}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
