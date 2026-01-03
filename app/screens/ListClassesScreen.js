import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../config';

export default function ListClassesScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClasses = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/classes`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });
      const json = await res.json();
      
      if (res.ok) {
        setClasses(json.data || json.classes || []);
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch classes');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const deleteClass = async (id) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const token = await AsyncStorage.getItem('myschools_token');
            try {
              const res = await fetch(`${BASE_URL}/classes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + token },
              });
              const json = await res.json();
              
              if (res.ok) {
                Alert.alert('Success', 'Class deleted successfully');
                fetchClasses();
              } else {
                Alert.alert('Error', json.message || 'Failed to delete class');
              }
            } catch (err) {
              Alert.alert('Error', err.message || 'Unable to connect to server');
            }
          },
        },
      ]
    );
  };

  const renderClass = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.className}>{item.class_name || item.name || 'Unnamed Class'}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.label}>School ID: <Text style={styles.value}>{item.school_id || 'N/A'}</Text></Text>
        <Text style={styles.label}>Major ID: <Text style={styles.value}>{item.major_id || 'N/A'}</Text></Text>
        <Text style={styles.label}>Grade/Level: <Text style={styles.value}>{item.grade_level || 'N/A'}</Text></Text>
        <Text style={styles.label}>Section: <Text style={styles.value}>{item.section || 'N/A'}</Text></Text>
        {item.id && <Text style={styles.label}>Class ID: <Text style={styles.value}>{item.id}</Text></Text>}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteClass(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes List</Text>
        <Button title="+ Create Class" onPress={() => router.push('/screens/CreateClassScreen')} />
      </View>
      
      {classes.length === 0 ? (
        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.emptyText}>No classes found</Text>
          <Text style={styles.emptySubtext}>Create your first class to get started</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClass}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
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
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  className: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
