// Create Major Screen
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
    Button,
    Card,
    ErrorBanner,
    Header,
    Input,
    Screen,
    Select,
    SuccessBanner,
    Text,
} from "../../../src/components/ui";
import { api, auth } from "../../../src/lib";

export default function CreateMajorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    school_id: params.school_id || "",
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Get current user to check role
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);

      // If user is school role, auto-set their school_id
      if (currentUser?.role === "school" && currentUser?.school_id) {
        setFormData(prev => ({ ...prev, school_id: currentUser.school_id }));
      }

      // Only admin needs to see school list
      if (currentUser?.role === "admin") {
        const response = await api.schools.list();
        setSchools(response.data || []);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

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

    if (!formData.school_id) {
      newErrors.school_id = "School is required";
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
        school_id: formData.school_id,
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

  const schoolOptions = schools.map((s) => ({
    label: s.school_name,
    value: s.id,
  }));

  const isSchoolRole = user?.role === "school";

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

        {/* School Selection - Only for Admin */}
        {!isSchoolRole && (
          <Select
            label="School"
            value={formData.school_id}
            onValueChange={(value) => updateField("school_id", value)}
            options={schoolOptions}
            placeholder="Select a school"
            error={errors.school_id}
            required
            disabled={loadingData}
          />
        )}

        {/* Show school info for school role */}
        {isSchoolRole && user?.school_name && (
          <View className="bg-primary-50 p-3 rounded-lg mb-4">
            <Text className="text-sm text-primary-700">
              <Ionicons name="business-outline" size={14} /> Creating major for: {user.school_name}
            </Text>
          </View>
        )}

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
            Create Major
          </Button>
        </View>
      </View>
    </Screen>
  );
}
