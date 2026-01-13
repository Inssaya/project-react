// Register Screen - Clean NativeWind implementation
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import {
    Button,
    ErrorBanner,
    Heading,
    Input,
    Screen,
    Select,
    Subtitle,
    Text,
} from "../../src/components/ui";
import { auth } from "../../src/lib";

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { label: "Student", value: "student" },
    { label: "Teacher", value: "teacher" },
    { label: "Admin", value: "admin" },
  ];

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
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

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await auth.register({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });
      router.replace("/(main)/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard className="bg-white">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
          <Ionicons name="person-add" size={32} color="white" />
        </View>
        <Heading size="lg">Create Account</Heading>
        <Subtitle className="mt-2 text-center">
          Join MySchools to manage your education
        </Subtitle>
      </View>

      {/* Error Banner */}
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {/* Form */}
      <View className="space-y-1">
        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => updateField("firstName", text)}
              placeholder="John"
              error={errors.firstName}
              required
            />
          </View>
          <View className="flex-1">
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => updateField("lastName", text)}
              placeholder="Doe"
              error={errors.lastName}
              required
            />
          </View>
        </View>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          placeholder="john.doe@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<Ionicons name="mail-outline" size={20} color="#71717A" />}
          required
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateField("password", text)}
          placeholder="At least 6 characters"
          secureTextEntry
          error={errors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
          required
        />

        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => updateField("confirmPassword", text)}
          placeholder="Re-enter your password"
          secureTextEntry
          error={errors.confirmPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
          required
        />

        <Select
          label="Role"
          value={formData.role}
          onValueChange={(value) => updateField("role", value)}
          options={roleOptions}
          placeholder="Select your role"
          error={errors.role}
          required
        />

        {/* Register Button */}
        <Button
          onPress={handleRegister}
          loading={loading}
          fullWidth
          size="lg"
          className="mt-4"
        >
          Create Account
        </Button>
      </View>

      {/* Login Link */}
      <View className="flex-row justify-center mt-6 mb-4">
        <Text className="text-surface-500">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text className="text-primary-500 font-semibold">Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
