// Input components
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { ErrorText, HelperText, Label } from "./Text";

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  required = false,
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "none",
  className = "",
  inputClassName = "",
  leftIcon,
  rightIcon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry;
  const actualSecure = isPassword && !showPassword;

  const baseInputClass = `
    bg-white border rounded-lg px-4 py-3 text-base text-surface-900
    ${multiline ? "min-h-[100px] text-start" : ""}
    ${leftIcon ? "pl-11" : ""}
    ${rightIcon || isPassword ? "pr-11" : ""}
    ${error ? "border-danger-500" : isFocused ? "border-primary-500" : "border-surface-300"}
    ${disabled ? "bg-surface-100 text-surface-400" : ""}
  `;

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Label required={required}>{label}</Label>}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            {leftIcon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          editable={!disabled}
          secureTextEntry={actualSecure}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseInputClass} ${inputClassName}`}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />

        {(rightIcon || isPassword) && (
          <View className="absolute right-3 top-0 bottom-0 justify-center">
            {isPassword ? (
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#71717A"
                />
              </Pressable>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>

      <ErrorText>{error}</ErrorText>
      {!error && <HelperText>{helper}</HelperText>}
    </View>
  );
}

// Search Input variant
export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  className = "",
  ...props
}) {
  return (
    <View className={`relative ${className}`}>
      <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
        <Ionicons name="search-outline" size={20} color="#71717A" />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        className="bg-white border border-surface-300 rounded-lg pl-11 pr-10 py-3 text-base text-surface-900"
        {...props}
      />

      {value ? (
        <Pressable
          onPress={onClear}
          className="absolute right-3 top-0 bottom-0 justify-center"
        >
          <Ionicons name="close-circle" size={20} color="#A1A1AA" />
        </Pressable>
      ) : null}
    </View>
  );
}

export default Input;
