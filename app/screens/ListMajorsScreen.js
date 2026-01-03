import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../config';

export default function ListMajorsScreen() {
  const router = useRouter();
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/majors`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const json = await res.json();
      if (json.success) {
        setMajors(json.data || []);
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch majors');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const renderMajor = ({ item }) => (
    <View style={styles.majorCard}>
      <Text style={styles.majorName}>{item.name || item.major_name || 'N/A'}</Text>
      <Text style={styles.majorDescription}>{item.description || 'No description'}</Text>
      <Text style={styles.majorSchool}>School ID: {item.school_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading majors...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Majors/Departments</Text>
        <Text style={styles.count}>{majors.length} major{majors.length !== 1 ? 's' : ''} found</Text>
      </View>
      
      {majors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No majors found</Text>
          <Text style={styles.emptySubtext}>Create a major to get started</Text>
        </View>
      ) : (
        <FlatList
          data={majors}
          renderItem={renderMajor}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  count: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
  },
  majorCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  majorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  majorDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  majorSchool: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});