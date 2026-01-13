// Create Class Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { api } from "../../../src/lib";

export default function CreateClassScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    school_id: "",
    grade_level: "",
    academic_year: "",
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const response = await api.schools.list();
      setSchools(response.data || []);
    } catch (err) {
      setError("Failed to load schools");
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
      newErrors.school_id = "Please select a school";
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
        grade_level: formData.grade_level || null,
        academic_year: formData.academic_year || null,
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
    label: s.name,
    value: s.id,
  }));

  const gradeOptions = [
    { label: "Grade 1", value: "1" },
    { label: "Grade 2", value: "2" },
    { label: "Grade 3", value: "3" },
    { label: "Grade 4", value: "4" },
    { label: "Grade 5", value: "5" },
    { label: "Grade 6", value: "6" },
    { label: "Grade 7", value: "7" },
    { label: "Grade 8", value: "8" },
    { label: "Grade 9", value: "9" },
    { label: "Grade 10", value: "10" },
    { label: "Grade 11", value: "11" },
    { label: "Grade 12", value: "12" },
  ];

  const yearOptions = [
    { label: "2024-2025", value: "2024-2025" },
    { label: "2025-2026", value: "2025-2026" },
    { label: "2026-2027", value: "2026-2027" },
  ];

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

        <Select
          label="Grade Level"
          value={formData.grade_level}
          onValueChange={(value) => updateField("grade_level", value)}
          options={gradeOptions}
          placeholder="Select grade level"
        />

        <Select
          label="Academic Year"
          value={formData.academic_year}
          onValueChange={(value) => updateField("academic_year", value)}
          options={yearOptions}
          placeholder="Select academic year"
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
            Create Class
          </Button>
        </View>
      </View>
    </Screen>
  );
}
