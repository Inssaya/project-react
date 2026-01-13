// Teachers List Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
    Avatar,
    Badge,
    Button,
    Empty,
    ErrorBanner,
    Header,
    ListCard,
    Loading,
    Screen,
    SearchInput,
} from "../../../src/components/ui";
import { api } from "../../../src/lib";

export default function TeachersListScreen() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadTeachers = useCallback(async () => {
    try {
      setError("");
      const response = await api.teachers.list();
      const data = response.data || [];
      setTeachers(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      setFiltered(
        teachers.filter(
          (t) =>
            t.first_name?.toLowerCase().includes(query) ||
            t.last_name?.toLowerCase().includes(query) ||
            t.user?.first_name?.toLowerCase().includes(query) ||
            t.user?.last_name?.toLowerCase().includes(query) ||
            t.user?.email?.toLowerCase().includes(query)
        )
      );
    } else {
      setFiltered(teachers);
    }
  }, [search, teachers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeachers();
    setRefreshing(false);
  };

  const getTeacherName = (teacher) => {
    const firstName = teacher.first_name || teacher.user?.first_name || "";
    const lastName = teacher.last_name || teacher.user?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={getTeacherName(item)}
      subtitle={item.user?.email || "No email"}
      description={item.school?.school_name || "No school assigned"}
      leftContent={<Avatar name={getTeacherName(item)} size="md" />}
      rightContent={
        <Badge variant="primary" size="sm">
          Teacher
        </Badge>
      }
      onPress={() => {/* Navigate to teacher details */}}
    />
  );

  return (
    <Screen padded={false} scroll={false}>
      <Header
        title="Teachers"
        subtitle={`${teachers.length} total`}
        showBack
        rightAction={
          <Button
            size="sm"
            onPress={() => router.push("/(main)/teachers/create")}
            icon={<Ionicons name="add" size={18} color="white" />}
          >
            Add
          </Button>
        }
      />

      <View className="flex-1 px-4 pt-4">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch("")}
          placeholder="Search teachers..."
          className="mb-4"
        />

        <ErrorBanner message={error} onRetry={loadTeachers} />

        {loading ? (
          <Loading message="Loading teachers..." />
        ) : filtered.length === 0 ? (
          <Empty
            icon="school-outline"
            title={search ? "No results found" : "No teachers yet"}
            message={
              search
                ? "Try a different search term"
                : "Add teachers to start assigning classes"
            }
            actionLabel={!search ? "Add Teacher" : undefined}
            onAction={
              !search ? () => router.push("/(main)/teachers/create") : undefined
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Screen>
  );
}
