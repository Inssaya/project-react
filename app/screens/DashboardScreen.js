import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../config';

export default function DashboardScreen() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const t = await AsyncStorage.getItem('myschools_token');
      const u = await AsyncStorage.getItem('myschools_user');
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
      
      if (!t) {
        Alert.alert('Session Expired', 'Please login again');
        router.replace('/Login');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const listSchools = async () => {
    if (!token) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/schools`, { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      const json = await res.json();
      
      if (json.success) {
        setSchools(json.data || []);
        if (!json.data || json.data.length === 0) {
          Alert.alert('Info', 'No schools found');
        }
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch schools');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('myschools_token');
    await AsyncStorage.removeItem('myschools_user');
    Alert.alert('Success', 'Logged out successfully');
    router.replace('/Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.userName}>{user ? `${user.first_name || user.full_name} ${user.last_name || ''}` : 'Unknown User'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user ? user.role.toUpperCase() : 'N/A'}</Text>
        </View>
        <Text style={styles.userEmail}>{user ? user.email : 'No email'}</Text>
      </View>

      {user && user.role === 'admin' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateSchoolScreen')}>
              <Text style={styles.actionBtnText}>➕ Create School</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateTeacherScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateStudentScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateClassScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateMajorScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Major</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>View Records</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListSchoolsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Schools</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListTeachersScreen')}>
              <Text style={styles.actionBtnText}>📋 List Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListStudentsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Students</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListClassesScreen')}>
              <Text style={styles.actionBtnText}>📋 List Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListMajorsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Majors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/RecordAttendanceScreen')}>
              <Text style={styles.actionBtnText}>✓ Record Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {user && user.role === 'school' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>School Management</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateClassScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateStudentScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateTeacherScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/CreateMajorScreen')}>
              <Text style={styles.actionBtnText}>➕ Create Major</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>View Records</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListClassesScreen')}>
              <Text style={styles.actionBtnText}>📋 List Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListMajorsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Majors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListStudentsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Students</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListTeachersScreen')}>
              <Text style={styles.actionBtnText}>📋 List Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/RecordAttendanceScreen')}>
              <Text style={styles.actionBtnText}>✓ Record Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {user && user.role === 'teacher' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teacher Actions</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/RecordAttendanceScreen')}>
              <Text style={styles.actionBtnText}>✓ Record Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/screens/RecordGradesScreen')}>
              <Text style={styles.actionBtnText}>📊 Record Grades</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>View Records</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListStudentsScreen')}>
              <Text style={styles.actionBtnText}>📋 List Students</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListClassesScreen')}>
              <Text style={styles.actionBtnText}>📋 List Classes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {user && user.role === 'student' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Portal</Text>
          <Text style={styles.infoText}>View your attendance records and class information.</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/screens/ListClassesScreen')}>
              <Text style={styles.actionBtnText}>📋 My Classes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  list: {
    marginTop: 15,
  },
  schoolCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  schoolAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtn: {
    backgroundColor: '#28a745',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});
