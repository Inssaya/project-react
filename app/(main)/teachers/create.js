// Create Teacher Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
    Button,
    Card,
    Divider,
    ErrorBanner,
    Header,
    Input,
    Screen,
    Select,
    SuccessBanner,
    Text,
} from "../../../src/components/ui";
import { api } from "../../../src/lib";

export default function CreateTeacherScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    specialization: "",
    school_id: "",
    phone: "",
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

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);
    try {
      await api.teachers.create({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        specialization: formData.specialization.trim() || null,
        school_id: formData.school_id || null,
        phone: formData.phone.trim() || null,
      });

      setSuccess("Teacher created successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  const schoolOptions = schools.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const specializationOptions = [
    { label: "Mathematics", value: "Mathematics" },
    { label: "Physics", value: "Physics" },
    { label: "Chemistry", value: "Chemistry" },
    { label: "Biology", value: "Biology" },
    { label: "English", value: "English" },
    { label: "History", value: "History" },
    { label: "Geography", value: "Geography" },
    { label: "Computer Science", value: "Computer Science" },
    { label: "Physical Education", value: "Physical Education" },
    { label: "Arts", value: "Arts" },
    { label: "Music", value: "Music" },
    { label: "Other", value: "Other" },
  ];

  return (
    <Screen keyboard>
      <Header title="Add Teacher" showBack />

      <View className="px-4 pt-6">
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-danger-50 rounded-full items-center justify-center">
              <Ionicons name="school" size={24} color="#EF4444" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold">New Teacher</Text>
              <Text className="text-surface-500 text-sm">
                Create a teacher account with login credentials
              </Text>
            </View>
          </View>
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <SuccessBanner message={success} />

        {/* Personal Info */}
        <Text className="text-sm font-semibold text-surface-500 mb-3">
          PERSONAL INFORMATION
        </Text>

        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Input
              label="First Name"
              value={formData.first_name}
              onChangeText={(text) => updateField("first_name", text)}
              placeholder="John"
              error={errors.first_name}
              required
            />
          </View>
          <View className="flex-1">
            <Input
              label="Last Name"
              value={formData.last_name}
              onChangeText={(text) => updateField("last_name", text)}
              placeholder="Doe"
              error={errors.last_name}
              required
            />
          </View>
        </View>

        <Input
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => updateField("phone", text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={20} color="#71717A" />}
        />

        <Select
          label="Specialization"
          value={formData.specialization}
          onValueChange={(value) => updateField("specialization", value)}
          options={specializationOptions}
          placeholder="Select specialization"
        />

        <Select
          label="School"
          value={formData.school_id}
          onValueChange={(value) => updateField("school_id", value)}
          options={schoolOptions}
          placeholder="Select a school"
          disabled={loadingData}
        />

        <Divider />

        {/* Account Info */}
        <Text className="text-sm font-semibold text-surface-500 mb-3">
          ACCOUNT CREDENTIALS
        </Text>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          placeholder="teacher@example.com"
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
          placeholder="At least 6 characters"
          secureTextEntry
          error={errors.password}
          required
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#71717A" />}
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
            Add Teacher
          </Button>
        </View>
      </View>
    </Screen>
  );
}
