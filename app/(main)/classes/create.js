// Create Class Screen
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

export default function CreateClassScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    school_id: params.school_id || "",
    major_id: "",
    year: "",
  });
  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
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
        // Load majors for this school
        try {
          const majorsRes = await api.majors.list();
          setMajors((majorsRes.data || []).filter(m => m.school_id === currentUser.school_id));
        } catch {}
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
      newErrors.name = "Class name is required";
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
      await api.classes.create({
        name: formData.name.trim(),
        school_id: formData.school_id,
        major_id: formData.major_id || null,
        year: formData.year || null,
      });

      setSuccess("Class created successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const schoolOptions = schools.map((s) => ({
    label: s.school_name,
    value: s.id,
  }));

  const majorOptions = majors.map((m) => ({
    label: m.name,
    value: m.id,
  }));

  const yearOptions = [
    { label: "2024-2025", value: "2024-2025" },
    { label: "2025-2026", value: "2025-2026" },
    { label: "2026-2027", value: "2026-2027" },
  ];

  const isSchoolRole = user?.role === "school";

  return (
    <Screen keyboard>
      <Header title="Create Class" showBack />

      <View className="px-4 pt-6">
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-success-50 rounded-full items-center justify-center">
              <Ionicons name="library" size={24} color="#10B981" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold">New Class</Text>
              <Text className="text-surface-500 text-sm">
                Add a new class to a school
              </Text>
            </View>
          </View>
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <SuccessBanner message={success} />

        <Input
          label="Class Name"
          value={formData.name}
          onChangeText={(text) => updateField("name", text)}
          placeholder="e.g., Class 10-A, Section B"
          error={errors.name}
          required
          leftIcon={<Ionicons name="library-outline" size={20} color="#71717A" />}
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
              <Ionicons name="business-outline" size={14} /> Creating class for: {user.school_name}
            </Text>
          </View>
        )}

        {/* Major Selection - Optional */}
        {majors.length > 0 && (
          <Select
            label="Major (Optional)"
            value={formData.major_id}
            onValueChange={(value) => updateField("major_id", value)}
            options={majorOptions}
            placeholder="Select a major"
          />
        )}

        <Select
          label="Academic Year"
          value={formData.year}
          onValueChange={(value) => updateField("year", value)}
          options={yearOptions}
          placeholder="Select academic year"
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
            Create Class
          </Button>
        </View>
      </View>
    </Screen>
  );
}
