// Create Student Screen
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

export default function CreateStudentScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    roll_number: "",
    class_id: "",
    date_of_birth: "",
    parent_contact: "",
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await api.classes.list();
      setClasses(response.data || []);
    } catch (err) {
      setError("Failed to load classes");
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
      await api.students.create({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roll_number: formData.roll_number.trim() || null,
        class_id: formData.class_id || null,
        date_of_birth: formData.date_of_birth || null,
        parent_contact: formData.parent_contact.trim() || null,
      });

      setSuccess("Student created successfully!");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const classOptions = classes.map((c) => ({
    label: `${c.name} (${c.school?.name || "No school"})`,
    value: c.id,
  }));

  return (
    <Screen keyboard>
      <Header title="Add Student" showBack />

      <View className="px-4 pt-6">
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-warning-50 rounded-full items-center justify-center">
              <Ionicons name="person-add" size={24} color="#F59E0B" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold">New Student</Text>
              <Text className="text-surface-500 text-sm">
                Create a student account with login credentials
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
          label="Roll Number"
          value={formData.roll_number}
          onChangeText={(text) => updateField("roll_number", text)}
          placeholder="e.g., STU-2025-001"
          leftIcon={<Ionicons name="id-card-outline" size={20} color="#71717A" />}
        />

        <Input
          label="Parent Contact"
          value={formData.parent_contact}
          onChangeText={(text) => updateField("parent_contact", text)}
          placeholder="Parent phone number"
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={20} color="#71717A" />}
        />

        <Select
          label="Class"
          value={formData.class_id}
          onValueChange={(value) => updateField("class_id", value)}
          options={classOptions}
          placeholder="Select a class"
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
          placeholder="student@example.com"
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
            Add Student
          </Button>
        </View>
      </View>
    </Screen>
  );
}
