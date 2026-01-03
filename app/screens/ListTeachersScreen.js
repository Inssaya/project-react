import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../config';

export default function ListTeachersScreen() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeachers = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/teachers`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });
      const json = await res.json();
      
      if (res.ok) {
        setTeachers(json.data || json.teachers || []);
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeachers();
  };

  const deleteTeacher = async (id) => {
    Alert.alert(
      'Delete Teacher',
      'Are you sure you want to delete this teacher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const token = await AsyncStorage.getItem('myschools_token');
            try {
              const res = await fetch(`${BASE_URL}/teachers/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + token },
              });
              const json = await res.json();
              
              if (res.ok) {
                Alert.alert('Success', 'Teacher deleted successfully');
                fetchTeachers();
              } else {
                Alert.alert('Error', json.message || 'Failed to delete teacher');
              }
            } catch (err) {
              Alert.alert('Error', err.message || 'Unable to connect to server');
            }
          },
        },
      ]
    );
  };

  const renderTeacher = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.teacherName}>
          {item.first_name || item.user?.first_name || 'N/A'} {item.last_name || item.user?.last_name || ''}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.label}>Email: <Text style={styles.value}>{item.email || item.user?.email || 'N/A'}</Text></Text>
        <Text style={styles.label}>Phone: <Text style={styles.value}>{item.phone_number || item.user?.phone_number || 'N/A'}</Text></Text>
        <Text style={styles.label}>School ID: <Text style={styles.value}>{item.school_id || 'N/A'}</Text></Text>
        <Text style={styles.label}>Hire Date: <Text style={styles.value}>{item.hire_date || 'N/A'}</Text></Text>
        {item.user_id && <Text style={styles.label}>User ID: <Text style={styles.value}>{item.user_id}</Text></Text>}
        {item.id && <Text style={styles.label}>Teacher ID: <Text style={styles.value}>{item.id}</Text></Text>}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTeacher(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading teachers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teachers List</Text>
        <Button title="+ Create Teacher" onPress={() => router.push('/screens/CreateTeacherScreen')} />
      </View>
      
      {teachers.length === 0 ? (
        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.emptyText}>No teachers found</Text>
          <Text style={styles.emptySubtext}>Create your first teacher to get started</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacher}
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
  teacherName: {
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
