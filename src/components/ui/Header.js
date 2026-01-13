// Header component for screens
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { Text } from "./Text";

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  className = "",
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={`
        bg-primary-500 px-4 pb-4
        ${Platform.OS === "android" ? "pt-12" : "pt-4"}
        ${className}
      `}
    >
      <View className="flex-row items-center">
        {showBack && (
          <Pressable
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center -ml-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}

        <View className="flex-1">
          <Text className="text-white text-xl font-bold">{title}</Text>
          {subtitle && (
            <Text className="text-white/80 text-sm mt-0.5">{subtitle}</Text>
          )}
        </View>

        {rightAction && <View>{rightAction}</View>}
      </View>
    </View>
  );
}

// Simple page header (not the main app header)
export function PageHeader({ title, subtitle, action, className = "" }) {
  return (
    <View className={`flex-row items-center justify-between mb-6 ${className}`}>
      <View className="flex-1">
        <Text className="text-2xl font-bold">{title}</Text>
        {subtitle && <Text className="text-surface-500 mt-1">{subtitle}</Text>}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}

export default Header;
