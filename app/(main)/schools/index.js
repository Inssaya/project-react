// Schools List Screen
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
    SearchInput
} from "../../../src/components/ui";
import { api } from "../../../src/lib";

export default function SchoolsListScreen() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSchools = useCallback(async () => {
    try {
      setError("");
      const response = await api.schools.list();
      const data = response.data || [];
      setSchools(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      setFiltered(
        schools.filter(
          (s) =>
            s.name?.toLowerCase().includes(query) ||
            s.address?.toLowerCase().includes(query)
        )
      );
    } else {
      setFiltered(schools);
    }
  }, [search, schools]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchools();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={item.name}
      subtitle={item.address || "No address"}
      description={item.phone || item.email}
      leftContent={
        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
          <Ionicons name="business" size={24} color="#3B82F6" />
        </View>
      }
      rightContent={
        <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
      }
      onPress={() => {/* Navigate to school details */}}
    />
  );

  return (
    <Screen padded={false} scroll={false}>
      <Header
        title="Schools"
        subtitle={`${schools.length} total`}
        showBack
        rightAction={
          <Button
            size="sm"
            onPress={() => router.push("/(main)/schools/create")}
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
          placeholder="Search schools..."
          className="mb-4"
        />

        <ErrorBanner message={error} onRetry={loadSchools} />

        {loading ? (
          <Loading message="Loading schools..." />
        ) : filtered.length === 0 ? (
          <Empty
            icon="business-outline"
            title={search ? "No results found" : "No schools yet"}
            message={
              search
                ? "Try a different search term"
                : "Create your first school to get started"
            }
            actionLabel={!search ? "Create School" : undefined}
            onAction={
              !search ? () => router.push("/(main)/schools/create") : undefined
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
