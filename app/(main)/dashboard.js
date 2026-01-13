// Dashboard Screen - Role-based with stats and quick actions
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import {
    Avatar,
    Button,
    Card,
    ErrorScreen,
    Heading,
    Loading,
    RoleBadge,
    Screen,
    SectionCard,
    StatCard,
    Text
} from "../../src/components/ui";
import { api, auth } from "../../src/lib";

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      
      // Get current user
      const currentUser = await auth.getCurrentUser();
      if (!currentUser) {
        router.replace("/(auth)/login");
        return;
      }
      setUser(currentUser);

      // Load stats based on role
      const statsData = {};

      try {
        const schoolsRes = await api.schools.list();
        statsData.schools = schoolsRes.data?.length || 0;
      } catch {
        statsData.schools = 0;
      }

      try {
        const classesRes = await api.classes.list();
        statsData.classes = classesRes.data?.length || 0;
      } catch {
        statsData.classes = 0;
      }

      try {
        const studentsRes = await api.students.list();
        statsData.students = studentsRes.data?.length || 0;
      } catch {
        statsData.students = 0;
      }

      try {
        const teachersRes = await api.teachers.list();
        statsData.teachers = teachersRes.data?.length || 0;
      } catch {
        statsData.teachers = 0;
      }

      setStats(statsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await auth.logout();
    router.replace("/(auth)/login");
  };

  if (loading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={loadData} />;
  }

  // Quick actions based on role
  const getQuickActions = () => {
    const allActions = [
      {
        id: "schools",
        label: "Schools",
        icon: "business",
        route: "/(main)/schools",
        color: "primary",
        roles: ["admin"],
      },
      {
        id: "classes",
        label: "Classes",
        icon: "library",
        route: "/(main)/classes",
        color: "success",
        roles: ["admin", "teacher"],
      },
      {
        id: "students",
        label: "Students",
        icon: "people",
        route: "/(main)/students",
        color: "warning",
        roles: ["admin", "teacher"],
      },
      {
        id: "teachers",
        label: "Teachers",
        icon: "school",
        route: "/(main)/teachers",
        color: "danger",
        roles: ["admin"],
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: "checkmark-done",
        route: "/(main)/attendance",
        color: "success",
        roles: ["admin", "teacher"],
      },
      {
        id: "grades",
        label: "Grades",
        icon: "ribbon",
        route: "/(main)/grades",
        color: "primary",
        roles: ["admin", "teacher"],
      },
      {
        id: "majors",
        label: "Majors",
        icon: "bookmark",
        route: "/(main)/majors",
        color: "warning",
        roles: ["admin"],
      },
    ];

    return allActions.filter((action) => action.roles.includes(user?.role));
  };

  const iconColors = {
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  return (
    <Screen
      scroll
      padded={false}
      contentClassName="pb-8"
    >
      {/* Header */}
      <View className="bg-primary-500 px-5 pt-14 pb-8 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-white/80 text-sm">Welcome back,</Text>
            <Heading size="md" className="text-white mt-1">
              {user?.full_name || user?.first_name || "User"}
            </Heading>
          </View>
          
          <View className="flex-row items-center space-x-3">
            <Pressable
              onPress={() => {/* notifications */}}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="notifications-outline" size={22} color="white" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Avatar name={user?.full_name || "U"} size="md" />
            </Pressable>
          </View>
        </View>

        {/* User Card */}
        <Card className="bg-white/10 border-0">
          <View className="flex-row items-center">
            <Avatar name={user?.full_name || "U"} size="lg" />
            <View className="flex-1 ml-4">
              <Text className="text-white font-semibold text-lg">
                {user?.full_name || "Unknown User"}
              </Text>
              <Text className="text-white/70 text-sm">{user?.email}</Text>
              <View className="mt-2">
                <RoleBadge role={user?.role} />
              </View>
            </View>
            <Pressable
              onPress={handleLogout}
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-medium">Logout</Text>
            </Pressable>
          </View>
        </Card>
      </View>

      {/* Stats Grid */}
      <View className="px-5 -mt-4">
        <View className="flex-row flex-wrap -mx-1.5">
          <View className="w-1/2 px-1.5 mb-3">
            <StatCard
              title="Schools"
              value={stats.schools || 0}
              icon={<Ionicons name="business" size={24} color="#3B82F6" />}
              color="primary"
              onPress={() => router.push("/(main)/schools")}
            />
          </View>
          <View className="w-1/2 px-1.5 mb-3">
            <StatCard
              title="Classes"
              value={stats.classes || 0}
              icon={<Ionicons name="library" size={24} color="#10B981" />}
              color="success"
              onPress={() => router.push("/(main)/classes")}
            />
          </View>
          <View className="w-1/2 px-1.5 mb-3">
            <StatCard
              title="Students"
              value={stats.students || 0}
              icon={<Ionicons name="people" size={24} color="#F59E0B" />}
              color="warning"
              onPress={() => router.push("/(main)/students")}
            />
          </View>
          <View className="w-1/2 px-1.5 mb-3">
            <StatCard
              title="Teachers"
              value={stats.teachers || 0}
              icon={<Ionicons name="school" size={24} color="#EF4444" />}
              color="danger"
              onPress={() => router.push("/(main)/teachers")}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mt-4">
        <SectionCard
          title="Quick Actions"
          subtitle="Manage your school data"
        >
          <View className="flex-row flex-wrap -mx-1.5">
            {getQuickActions().map((action) => (
              <Pressable
                key={action.id}
                onPress={() => router.push(action.route)}
                className="w-1/3 px-1.5 mb-3"
              >
                <View className="bg-white border border-surface-200 rounded-xl p-4 items-center">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center mb-2 bg-${action.color}-50`}
                  >
                    <Ionicons
                      name={action.icon}
                      size={24}
                      color={iconColors[action.color]}
                    />
                  </View>
                  <Text className="text-sm text-center font-medium">
                    {action.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      </View>

      {/* Role-specific content */}
      {user?.role === "student" && (
        <View className="px-5 mt-2">
          <SectionCard title="Your Portal" subtitle="Access your information">
            <Card variant="outlined">
              <View className="items-center py-4">
                <Ionicons name="school-outline" size={48} color="#A1A1AA" />
                <Text className="mt-4 text-center">
                  View your attendance records, grades, and class schedule.
                </Text>
                <Button className="mt-4" variant="outline">
                  View My Records
                </Button>
              </View>
            </Card>
          </SectionCard>
        </View>
      )}
    </Screen>
  );
}
