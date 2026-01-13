// Divider component
import { View } from "react-native";
import { Text } from "./Text";

export function Divider({ className = "" }) {
  return <View className={`h-px bg-surface-200 my-4 ${className}`} />;
}

export function DividerWithText({ children, className = "" }) {
  return (
    <View className={`flex-row items-center my-4 ${className}`}>
      <View className="flex-1 h-px bg-surface-200" />
      <Text className="mx-4 text-surface-400 text-sm">{children}</Text>
      <View className="flex-1 h-px bg-surface-200" />
    </View>
  );
}

export default Divider;
