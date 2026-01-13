// Create Major Screen
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

export default function CreateMajorScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
      newErrors.name = "Major name is required";
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
      await api.majors.create({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      setSuccess("Major created successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create major");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen keyboard>
      <Header title="Create Major" showBack />

      <View className="px-4 pt-6">
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-warning-50 rounded-full items-center justify-center">
              <Ionicons name="bookmark" size={24} color="#F59E0B" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold">New Major</Text>
              <Text className="text-surface-500 text-sm">
                Add a new major or specialization
              </Text>
            </View>
          </View>
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <SuccessBanner message={success} />

        <Input
          label="Major Name"
          value={formData.name}
          onChangeText={(text) => updateField("name", text)}
          placeholder="e.g., Computer Science, Mathematics"
          error={errors.name}
          required
          leftIcon={<Ionicons name="bookmark-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => updateField("description", text)}
          placeholder="Brief description of the major"
          multiline
          numberOfLines={3}
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
            Create Major
          </Button>
        </View>
      </View>
    </Screen>
  );
}
