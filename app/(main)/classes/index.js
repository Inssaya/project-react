// Classes List Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
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

export default function ClassesListScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadClasses = useCallback(async () => {
    try {
      setError("");
      const response = await api.classes.list();
      const data = response.data || [];
      setClasses(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      setFiltered(
        classes.filter(
          (c) =>
            c.name?.toLowerCase().includes(query) ||
            c.school?.name?.toLowerCase().includes(query)
        )
      );
    } else {
      setFiltered(classes);
    }
  }, [search, classes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={item.name}
      subtitle={item.school?.school_name || "No school assigned"}
      description={item.year ? `Year: ${item.year}` : ""}
      leftContent={
        <View className="w-12 h-12 bg-success-50 rounded-full items-center justify-center">
          <Ionicons name="library" size={24} color="#10B981" />
        </View>
      }
      rightContent={
        <View className="items-end">
          <Badge variant="success" size="sm">
            {item.students_count || 0} students
          </Badge>
        </View>
      }
      onPress={() => {/* Navigate to class details */}}
    />
  );

  return (
    <Screen padded={false} scroll={false}>
      <Header
        title="Classes"
        subtitle={`${classes.length} total`}
        showBack
        rightAction={
          <Button
            size="sm"
            onPress={() => router.push("/(main)/classes/create")}
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
          placeholder="Search classes..."
          className="mb-4"
        />

        <ErrorBanner message={error} onRetry={loadClasses} />

        {loading ? (
          <Loading message="Loading classes..." />
        ) : filtered.length === 0 ? (
          <Empty
            icon="library-outline"
            title={search ? "No results found" : "No classes yet"}
            message={
              search
                ? "Try a different search term"
                : "Create your first class to get started"
            }
            actionLabel={!search ? "Create Class" : undefined}
            onAction={
              !search ? () => router.push("/(main)/classes/create") : undefined
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
