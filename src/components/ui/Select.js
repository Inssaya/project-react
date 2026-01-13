// Select/Picker component with consistent styling
import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import { ErrorText, HelperText, Label } from "./Text";

export function Select({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option",
  error,
  helper,
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const borderClass = error
    ? "border-danger-500"
    : "border-surface-300";

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Label required={required}>{label}</Label>}

      <View
        className={`
          bg-white border rounded-lg overflow-hidden
          ${borderClass}
          ${disabled ? "bg-surface-100 opacity-50" : ""}
        `}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={{ marginVertical: -8 }}
          {...props}
        >
          <Picker.Item label={placeholder} value="" color="#A1A1AA" />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <ErrorText>{error}</ErrorText>
      {!error && <HelperText>{helper}</HelperText>}
    </View>
  );
}

export default Select;
