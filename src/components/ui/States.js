// State components - Loading, Empty, Error states
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { Button } from "./Button";
import { Subtitle, Text } from "./Text";

// Loading State
export function Loading({ message = "Loading...", fullScreen = false, className = "" }) {
  const containerClass = fullScreen
    ? "flex-1 items-center justify-center bg-surface-50"
    : "items-center justify-center py-12";

  return (
    <View className={`${containerClass} ${className}`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-surface-500 mt-4">{message}</Text>
    </View>
  );
}

// Empty State
export function Empty({
  icon = "folder-open-outline",
  title = "No data found",
  message,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <View className={`items-center justify-center py-16 px-8 ${className}`}>
      <View className="w-20 h-20 rounded-full bg-surface-100 items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color="#A1A1AA" />
      </View>
      <Text className="text-lg font-semibold text-center">{title}</Text>
      {message && (
        <Subtitle className="text-center mt-2 max-w-xs">{message}</Subtitle>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

// Error Banner (inline)
export function ErrorBanner({
  message,
  onRetry,
  onDismiss,
  className = "",
}) {
  if (!message) return null;

  return (
    <View
      className={`
        bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4
        flex-row items-start
        ${className}
      `}
    >
      <Ionicons name="alert-circle" size={20} color="#EF4444" />
      <View className="flex-1 ml-3">
        <Text className="text-danger-600 text-sm">{message}</Text>
        {(onRetry || onDismiss) && (
          <View className="flex-row mt-2 gap-4">
            {onRetry && (
              <Button variant="ghost" size="sm" onPress={onRetry}>
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onPress={onDismiss}>
                Dismiss
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// Success Banner
export function SuccessBanner({ message, onDismiss, className = "" }) {
  if (!message) return null;

  return (
    <View
      className={`
        bg-success-50 border border-success-200 rounded-lg p-4 mb-4
        flex-row items-center
        ${className}
      `}
    >
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <Text className="flex-1 ml-3 text-success-600 text-sm">{message}</Text>
      {onDismiss && (
        <Button variant="ghost" size="sm" onPress={onDismiss}>
          <Ionicons name="close" size={18} color="#10B981" />
        </Button>
      )}
    </View>
  );
}

// Full screen error
export function ErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className = "",
}) {
  return (
    <View className={`flex-1 items-center justify-center bg-surface-50 px-8 ${className}`}>
      <View className="w-20 h-20 rounded-full bg-danger-50 items-center justify-center mb-4">
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
      </View>
      <Text className="text-xl font-semibold text-center">{title}</Text>
      <Subtitle className="text-center mt-2 max-w-xs">{message}</Subtitle>
      {onRetry && (
        <Button onPress={onRetry} className="mt-6">
          Try Again
        </Button>
      )}
    </View>
  );
}
