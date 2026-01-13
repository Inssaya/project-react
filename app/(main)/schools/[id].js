// School Details Screen
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
    Badge,
    Button,
    Card,
    Divider,
    ErrorBanner,
    Header,
    Loading,
    Screen,
    Text,
} from "../../../src/components/ui";
import { api } from "../../../src/lib";

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [school, setSchool] = useState(null);
  const [stats, setStats] = useState({ teachers: 0, students: 0, classes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchool = useCallback(async () => {
    try {
      setError("");
      const response = await api.schools.get(id);
      setSchool(response.data);
      
      // Load stats (teachers, students, classes count)
      try {
        const [teachersRes, studentsRes, classesRes] = await Promise.all([
          api.teachers.list(),
          api.students.list(),
          api.classes.list(),
        ]);
        
        setStats({
          teachers: (teachersRes.data || []).filter(t => t.school_id === id).length,
          students: (studentsRes.data || []).filter(s => s.school_id === id).length,
          classes: (classesRes.data || []).filter(c => c.school_id === id).length,
        });
      } catch (e) {
        // Stats are optional
      }
    } catch (err) {
      setError(err.message || "Failed to load school");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadSchool();
  }, [id, loadSchool]);

  const handleDelete = () => {
    Alert.alert(
      "Delete School",
      `Are you sure you want to delete "${school?.school_name}"? This will also delete all associated teachers, students, and classes.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.schools.delete(id);
              router.back();
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete school");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Screen>
        <Header title="School Details" showBack />
        <Loading message="Loading school..." />
      </Screen>
    );
  }

  if (error || !school) {
    return (
      <Screen>
        <Header title="School Details" showBack />
        <View className="px-4 pt-6">
          <ErrorBanner message={error || "School not found"} onRetry={loadSchool} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="School Details"
        showBack
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleDelete}
            icon={<Ionicons name="trash-outline" size={20} color="#EF4444" />}
          />
        }
      />

      <ScrollView className="flex-1 px-4 pt-6">
        {/* School Header */}
        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center">
              <Ionicons name="business" size={32} color="#3B82F6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold">{school.school_name}</Text>
              <Badge variant="primary" className="mt-1 self-start">
                School Account
              </Badge>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <View className="flex-row mb-4">
          <Card className="flex-1 mr-2">
            <View className="items-center">
              <Ionicons name="people" size={24} color="#3B82F6" />
              <Text className="text-2xl font-bold mt-1">{stats.teachers}</Text>
              <Text className="text-surface-500 text-xs">Teachers</Text>
            </View>
          </Card>
          <Card className="flex-1 mx-2">
            <View className="items-center">
              <Ionicons name="school" size={24} color="#10B981" />
              <Text className="text-2xl font-bold mt-1">{stats.students}</Text>
              <Text className="text-surface-500 text-xs">Students</Text>
            </View>
          </Card>
          <Card className="flex-1 ml-2">
            <View className="items-center">
              <Ionicons name="grid" size={24} color="#F59E0B" />
              <Text className="text-2xl font-bold mt-1">{stats.classes}</Text>
              <Text className="text-surface-500 text-xs">Classes</Text>
            </View>
          </Card>
        </View>

        {/* Contact Info */}
        <Card className="mb-4">
          <Text className="font-semibold mb-3">Contact Information</Text>
          <Divider className="mb-3" />
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="mail-outline" size={20} color="#71717A" />
            <Text className="ml-3 flex-1">{school.email || "No email"}</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="call-outline" size={20} color="#71717A" />
            <Text className="ml-3 flex-1">{school.phone_number || "No phone"}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={20} color="#71717A" />
            <Text className="ml-3 flex-1">{school.address || "No address"}</Text>
          </View>
        </Card>

        {/* Actions */}
        <Card className="mb-8">
          <Text className="font-semibold mb-3">Quick Actions</Text>
          <Divider className="mb-3" />
          
          <Button
            variant="secondary"
            className="mb-2"
            onPress={() => router.push({ pathname: "/(main)/teachers/create", params: { school_id: id } })}
            icon={<Ionicons name="person-add-outline" size={18} color="#3B82F6" />}
          >
            Add Teacher to School
          </Button>
          
          <Button
            variant="secondary"
            className="mb-2"
            onPress={() => router.push({ pathname: "/(main)/students/create", params: { school_id: id } })}
            icon={<Ionicons name="school-outline" size={18} color="#3B82F6" />}
          >
            Add Student to School
          </Button>
          
          <Button
            variant="secondary"
            onPress={() => router.push({ pathname: "/(main)/classes/create", params: { school_id: id } })}
            icon={<Ionicons name="grid-outline" size={18} color="#3B82F6" />}
          >
            Add Class to School
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}
