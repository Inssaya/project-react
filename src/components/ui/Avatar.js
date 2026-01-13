// Avatar component
import { Image, View } from "react-native";
import { Text } from "./Text";

export function Avatar({
  source,
  name,
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-2xl",
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate consistent color from name
  const getColorClass = (name) => {
    if (!name) return "bg-surface-300";
    const colors = [
      "bg-primary-500",
      "bg-success-500",
      "bg-warning-500",
      "bg-danger-500",
      "bg-primary-600",
      "bg-success-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (source) {
    return (
      <Image
        source={typeof source === "string" ? { uri: source } : source}
        className={`${sizeClasses[size]} rounded-full ${className}`}
      />
    );
  }

  return (
    <View
      className={`
        ${sizeClasses[size]}
        ${getColorClass(name)}
        rounded-full items-center justify-center
        ${className}
      `}
    >
      <Text className={`text-white font-semibold ${textSizeClasses[size]}`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

export default Avatar;
