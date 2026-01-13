// Card components
import { Pressable, View } from "react-native";
import { Subtitle, Text } from "./Text";

export function Card({
  children,
  className = "",
  onPress,
  variant = "elevated",
  ...props
}) {
  const variantClasses = {
    elevated: "bg-white shadow-sm shadow-surface-300",
    outlined: "bg-white border border-surface-200",
    filled: "bg-surface-100",
  };

  const Component = onPress ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      className={`
        rounded-xl p-4
        ${variantClasses[variant]}
        ${onPress ? "active:opacity-90" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

// Stat Card - for dashboard statistics
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  onPress,
  className = "",
}) {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-600",
  };

  return (
    <Card onPress={onPress} className={`${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Subtitle className="text-sm">{title}</Subtitle>
          <Text className="text-2xl font-bold mt-1">{value}</Text>
          {subtitle && <Subtitle className="text-xs mt-1">{subtitle}</Subtitle>}
        </View>
        {icon && (
          <View className={`w-12 h-12 rounded-full items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </View>
        )}
      </View>
    </Card>
  );
}

// List Item Card
export function ListCard({
  title,
  subtitle,
  description,
  leftContent,
  rightContent,
  onPress,
  className = "",
}) {
  return (
    <Card onPress={onPress} variant="outlined" className={`mb-3 ${className}`}>
      <View className="flex-row items-center">
        {leftContent && <View className="mr-3">{leftContent}</View>}

        <View className="flex-1">
          <Text className="font-semibold">{title}</Text>
          {subtitle && <Subtitle className="text-sm mt-0.5">{subtitle}</Subtitle>}
          {description && (
            <Subtitle className="text-xs mt-1">{description}</Subtitle>
          )}
        </View>

        {rightContent && <View className="ml-3">{rightContent}</View>}
      </View>
    </Card>
  );
}

// Section Card with header
export function SectionCard({ title, subtitle, children, action, className = "" }) {
  return (
    <View className={`mb-6 ${className}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-lg font-semibold">{title}</Text>
          {subtitle && <Subtitle className="text-sm">{subtitle}</Subtitle>}
        </View>
        {action && <View>{action}</View>}
      </View>
      {children}
    </View>
  );
}

export default Card;
