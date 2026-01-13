// Create School Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
    Button,
    Card,
    ErrorBanner,
    Header,
    Input,
    Screen,
    SuccessBanner,
    Text,
} from "../../../src/components/ui";
import { api } from "../../../src/lib";

export default function CreateSchoolScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    school_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.school_name.trim()) {
      newErrors.school_name = "School name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);
    try {
      await api.schools.create({
        school_name: formData.school_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        address: formData.address.trim() || null,
        phone_number: formData.phone_number.trim() || null,
      });

      setSuccess("School created successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard>
      <Header title="Create School" showBack />

      <View className="px-4 pt-6">
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
              <Ionicons name="business" size={24} color="#3B82F6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold">New School</Text>
              <Text className="text-surface-500 text-sm">
                Create school account with login credentials
              </Text>
            </View>
          </View>
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <SuccessBanner message={success} />

        {/* School Information */}
        <Text className="text-sm font-medium text-surface-500 mb-2 mt-2">
          School Information
        </Text>

        <Input
          label="School Name"
          value={formData.school_name}
          onChangeText={(text) => updateField("school_name", text)}
          placeholder="Enter school name"
          error={errors.school_name}
          required
          leftIcon={<Ionicons name="business-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text) => updateField("address", text)}
          placeholder="Enter school address"
          multiline
          numberOfLines={2}
          leftIcon={<Ionicons name="location-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Phone"
          value={formData.phone_number}
          onChangeText={(text) => updateField("phone_number", text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={20} color="#71717A" />}
        />

        {/* Login Credentials */}
        <Text className="text-sm font-medium text-surface-500 mb-2 mt-6">
          Login Credentials
        </Text>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          placeholder="Enter school email for login"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          required
          leftIcon={<Ionicons name="mail-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateField("password", text)}
          placeholder="Create a password"
          secureTextEntry={!showPassword}
          error={errors.password}
          required
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
          rightIcon={
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#71717A"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => updateField("confirmPassword", text)}
          placeholder="Confirm password"
          secureTextEntry={!showPassword}
          error={errors.confirmPassword}
          required
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
        />

        <View className="flex-row space-x-3 mt-6 mb-8">
          <Button
            variant="secondary"
            onPress={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSubmit}
            loading={loading}
            className="flex-1"
          >
            Create School
          </Button>
        </View>
      </View>
    </Screen>
  );
}
