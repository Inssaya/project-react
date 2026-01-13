// Login Screen - Clean NativeWind implementation
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import {
    Button,
    DividerWithText,
    ErrorBanner,
    Heading,
    Input,
    Screen,
    Subtitle,
    Text,
} from "../../src/components/ui";
import { auth } from "../../src/lib";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await auth.login(email.trim().toLowerCase(), password);
      router.replace("/(main)/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard padded={false} className="bg-white">
      <View className="flex-1 px-6 pt-12">
        {/* Logo/Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-primary-500 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="school" size={40} color="white" />
          </View>
          <Heading size="lg">Welcome Back</Heading>
          <Subtitle className="mt-2 text-center">
            Sign in to continue to MySchools
          </Subtitle>
        </View>

        {/* Error Banner */}
        <ErrorBanner
          message={error}
          onDismiss={() => setError("")}
        />

        {/* Form */}
        <View className="space-y-1">
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color="#71717A" />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
          />

          {/* Forgot Password */}
          <View className="items-end mb-4">
            <Pressable>
              <Text className="text-primary-500 text-sm font-medium">
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          >
            Sign In
          </Button>
        </View>

        {/* Divider */}
        <DividerWithText>or continue with</DividerWithText>

        {/* Social Login (placeholder) */}
        <View className="flex-row justify-center space-x-4">
          <Pressable className="w-14 h-14 bg-surface-100 rounded-full items-center justify-center">
            <Ionicons name="logo-google" size={24} color="#71717A" />
          </Pressable>
          <Pressable className="w-14 h-14 bg-surface-100 rounded-full items-center justify-center">
            <Ionicons name="logo-apple" size={24} color="#71717A" />
          </Pressable>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-surface-500">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-primary-500 font-semibold">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
