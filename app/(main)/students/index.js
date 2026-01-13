// Students List Screen
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

export default function StudentsListScreen() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setError("");
      const response = await api.students.list();
      const data = response.data || [];
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      setFiltered(
        students.filter(
          (s) =>
            s.first_name?.toLowerCase().includes(query) ||
            s.last_name?.toLowerCase().includes(query) ||
            s.user?.first_name?.toLowerCase().includes(query) ||
            s.user?.last_name?.toLowerCase().includes(query) ||
            s.roll_number?.toLowerCase().includes(query)
        )
      );
    } else {
      setFiltered(students);
    }
  }, [search, students]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const getStudentName = (student) => {
    const firstName = student.first_name || student.user?.first_name || "";
    const lastName = student.last_name || student.user?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={getStudentName(item)}
      subtitle={`Roll: ${item.roll_number || "N/A"}`}
      description={item.class?.name || "No class assigned"}
      leftContent={<Avatar name={getStudentName(item)} size="md" />}
      rightContent={
        <Badge variant="success" size="sm">
          Active
        </Badge>
      }
      onPress={() => {/* Navigate to student details */}}
    />
  );

  return (
    <Screen padded={false} scroll={false}>
      <Header
        title="Students"
        subtitle={`${students.length} total`}
        showBack
        rightAction={
          <Button
            size="sm"
            onPress={() => router.push("/(main)/students/create")}
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
          placeholder="Search students..."
          className="mb-4"
        />

        <ErrorBanner message={error} onRetry={loadStudents} />

        {loading ? (
          <Loading message="Loading students..." />
        ) : filtered.length === 0 ? (
          <Empty
            icon="people-outline"
            title={search ? "No results found" : "No students yet"}
            message={
              search
                ? "Try a different search term"
                : "Add students to start managing attendance and grades"
            }
            actionLabel={!search ? "Add Student" : undefined}
            onAction={
              !search ? () => router.push("/(main)/students/create") : undefined
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
