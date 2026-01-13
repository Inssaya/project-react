// Badge component
import { View } from "react-native";
import { Text } from "./Text";

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}) {
  const variantClasses = {
    default: "bg-surface-200 text-surface-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-600",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1",
    lg: "px-3 py-1.5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <View
      className={`
        rounded-full self-start
        ${sizeClasses[size]}
        ${variantClasses[variant].split(" ")[0]}
        ${className}
      `}
    >
      <Text
        className={`
          font-semibold
          ${textSizeClasses[size]}
          ${variantClasses[variant].split(" ").slice(1).join(" ")}
        `}
      >
        {children}
      </Text>
    </View>
  );
}

// Role badge helper
export function RoleBadge({ role }) {
  const roleVariants = {
    admin: "danger",
    teacher: "primary",
    student: "success",
  };

  return (
    <Badge variant={roleVariants[role] || "default"}>
      {role?.toUpperCase() || "N/A"}
    </Badge>
  );
}

export default Badge;
