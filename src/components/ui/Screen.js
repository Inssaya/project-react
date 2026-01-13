// Screen - Base screen wrapper component
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({
  children,
  scroll = true,
  padded = true,
  keyboard = false,
  className = "",
  contentClassName = "",
  edges = ["top", "bottom"],
}) {
  const baseClass = "flex-1 bg-surface-50";
  const contentClass = padded ? "px-4 py-6" : "";

  const content = scroll ? (
    <ScrollView
      className={`flex-1 ${contentClass} ${contentClassName}`}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClass} ${contentClassName}`}>{children}</View>
  );

  if (keyboard) {
    return (
      <SafeAreaView className={`${baseClass} ${className}`} edges={edges}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView className={`${baseClass} ${className}`} edges={edges}>{content}</SafeAreaView>;
}

export default Screen;
