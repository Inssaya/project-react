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
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "School name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim().toLowerCase() || null,
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
                Add a new school to the system
              </Text>
            </View>
          </View>
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <SuccessBanner message={success} />

        <Input
          label="School Name"
          value={formData.name}
          onChangeText={(text) => updateField("name", text)}
          placeholder="Enter school name"
          error={errors.name}
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
          value={formData.phone}
          onChangeText={(text) => updateField("phone", text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          placeholder="Enter school email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<Ionicons name="mail-outline" size={20} color="#71717A" />}
        />

        <View className="flex-row space-x-3 mt-6">
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
