// Button component with variants
import { ActivityIndicator, Pressable } from "react-native";
import { Text } from "./Text";

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = "",
  ...props
}) {
  const baseClass = "flex-row items-center justify-center rounded-lg";

  const variantClasses = {
    primary: "bg-primary-500 active:bg-primary-600",
    secondary: "bg-surface-200 active:bg-surface-300",
    outline: "bg-transparent border-2 border-primary-500 active:bg-primary-50",
    ghost: "bg-transparent active:bg-surface-100",
    danger: "bg-danger-500 active:bg-danger-600",
    success: "bg-success-500 active:bg-success-600",
  };

  const disabledClass = "opacity-50";

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textVariantClasses = {
    primary: "text-white",
    secondary: "text-surface-700",
    outline: "text-primary-500",
    ghost: "text-primary-500",
    danger: "text-white",
    success: "text-white",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${baseClass}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? disabledClass : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#3B82F6" : "#FFFFFF"}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={`
              font-semibold
              ${textVariantClasses[variant]}
              ${textSizeClasses[size]}
              ${icon ? "ml-2" : ""}
            `}
          >
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// Icon Button (circular)
export function IconButton({
  icon,
  onPress,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variantClasses = {
    primary: "bg-primary-500 active:bg-primary-600",
    secondary: "bg-surface-200 active:bg-surface-300",
    ghost: "bg-transparent active:bg-surface-100",
    danger: "bg-danger-500 active:bg-danger-600",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        items-center justify-center rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
      {...props}
    >
      {icon}
    </Pressable>
  );
}

export default Button;
