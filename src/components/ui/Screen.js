// Screen - Base screen wrapper component
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";

export function Screen({
  children,
  scroll = true,
  padded = true,
  keyboard = false,
  className = "",
  contentClassName = "",
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
      <SafeAreaView className={`${baseClass} ${className}`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView className={`${baseClass} ${className}`}>{content}</SafeAreaView>;
}

export default Screen;
