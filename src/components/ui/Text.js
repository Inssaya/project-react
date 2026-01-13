// Typography components
import { Text as RNText } from "react-native";

// Base Text component
export function Text({ children, className = "", ...props }) {
  return (
    <RNText className={`text-surface-900 text-base ${className}`} {...props}>
      {children}
    </RNText>
  );
}

// Heading component (large titles)
export function Heading({ children, className = "", size = "xl", ...props }) {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold",
  };

  return (
    <RNText
      className={`text-surface-900 ${sizeClasses[size] || sizeClasses.xl} ${className}`}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Subtitle component
export function Subtitle({ children, className = "", ...props }) {
  return (
    <RNText className={`text-surface-500 text-base ${className}`} {...props}>
      {children}
    </RNText>
  );
}

// Label component (for form labels)
export function Label({ children, required = false, className = "", ...props }) {
  return (
    <RNText
      className={`text-surface-700 text-sm font-medium mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <RNText className="text-danger-500"> *</RNText>}
    </RNText>
  );
}

// Error text
export function ErrorText({ children, className = "", ...props }) {
  if (!children) return null;
  return (
    <RNText className={`text-danger-500 text-sm mt-1 ${className}`} {...props}>
      {children}
    </RNText>
  );
}

// Helper text
export function HelperText({ children, className = "", ...props }) {
  if (!children) return null;
  return (
    <RNText className={`text-surface-400 text-sm mt-1 ${className}`} {...props}>
      {children}
    </RNText>
  );
}
