// Majors List Screen
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
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

export default function MajorsListScreen() {
  const router = useRouter();
  const [majors, setMajors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadMajors = useCallback(async () => {
    try {
      setError("");
      const response = await api.majors.list();
      const data = response.data || [];
      setMajors(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || "Failed to load majors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMajors();
  }, [loadMajors]);

  useEffect(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      setFiltered(
        majors.filter(
          (m) =>
            m.name?.toLowerCase().includes(query) ||
            m.description?.toLowerCase().includes(query)
        )
      );
    } else {
      setFiltered(majors);
    }
  }, [search, majors]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMajors();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={item.name}
      subtitle={item.description || "No description"}
      leftContent={
        <View className="w-12 h-12 bg-warning-50 rounded-full items-center justify-center">
          <Ionicons name="bookmark" size={24} color="#F59E0B" />
        </View>
      }
      rightContent={
        <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
      }
      onPress={() => {/* Navigate to major details */}}
    />
  );

  return (
    <Screen padded={false} scroll={false}>
      <Header
        title="Majors"
        subtitle={`${majors.length} total`}
        showBack
        rightAction={
          <Button
            size="sm"
            onPress={() => router.push("/(main)/majors/create")}
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
          placeholder="Search majors..."
          className="mb-4"
        />

        <ErrorBanner message={error} onRetry={loadMajors} />

        {loading ? (
          <Loading message="Loading majors..." />
        ) : filtered.length === 0 ? (
          <Empty
            icon="bookmark-outline"
            title={search ? "No results found" : "No majors yet"}
            message={
              search
                ? "Try a different search term"
                : "Create majors to organize your curriculum"
            }
            actionLabel={!search ? "Create Major" : undefined}
            onAction={
              !search ? () => router.push("/(main)/majors/create") : undefined
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
