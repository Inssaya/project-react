import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../config';

export default function RecordAttendanceScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    try {
      // Fetch students
      const studentsRes = await fetch(`${BASE_URL}/students`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const studentsJson = await studentsRes.json();
      if (studentsRes.ok) {
        setStudents(studentsJson.data || []);
      }

      // Fetch classes
      const classesRes = await fetch(`${BASE_URL}/classes`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const classesJson = await classesRes.json();
      if (classesRes.ok) {
        setClasses(classesJson.data || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const submit = async () => {
    if (!studentId || !classId) {
      Alert.alert('Error', 'Student and Class are required');
      return;
    }

    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from stored user data
      const userStr = await AsyncStorage.getItem('myschools_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        Alert.alert('Error', 'Unable to get user information');
        return;
      }

      const res = await fetch(`${BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          student_id: studentId, 
          class_id: classId, 
          teacher_id: user.id, // Use current user's ID as teacher_id
          date, 
          status, 
          notes 
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', 'Attendance recorded successfully');
        // Clear form
        setStudentId('');
        setClassId('');
        setNotes('');
      } else {
        Alert.alert('Error', json.message || 'Failed to record attendance');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Record Attendance</Text>
        
        <Text style={styles.label}>Student *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={studentId}
            onValueChange={(value) => setStudentId(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select Student --" value="" />
            {students.map((student) => (
              <Picker.Item 
                key={student.id} 
                label={`${student.first_name || student.user?.first_name || 'N/A'} ${student.last_name || student.user?.last_name || ''} (${student.roll_number || 'No Roll'})`} 
                value={student.id} 
              />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.label}>Class *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={classId}
            onValueChange={(value) => setClassId(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select Class --" value="" />
            {classes.map((cls) => (
              <Picker.Item 
                key={cls.id} 
                label={cls.name || cls.class_name || 'N/A'} 
                value={cls.id} 
              />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput 
          style={styles.input}
          value={date} 
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          editable={!loading}
        />
        
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity 
            style={[styles.statusBtn, status === 'present' && styles.statusBtnActive]}
            onPress={() => setStatus('present')}
            disabled={loading}
          >
            <Text style={[styles.statusText, status === 'present' && styles.statusTextActive]}>
              Present
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusBtn, status === 'absent' && styles.statusBtnActive]}
            onPress={() => setStatus('absent')}
            disabled={loading}
          >
            <Text style={[styles.statusText, status === 'absent' && styles.statusTextActive]}>
              Absent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusBtn, status === 'late' && styles.statusBtnActive]}
            onPress={() => setStatus('late')}
            disabled={loading}
          >
            <Text style={[styles.statusText, status === 'late' && styles.statusTextActive]}>
              Late
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={notes} 
          onChangeText={setNotes}
          placeholder="Add any notes"
          multiline
          numberOfLines={3}
          editable={!loading}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <View style={styles.button}>
            <Button title="Record Attendance" onPress={submit} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  statusBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: '#007AFF',
  },
  statusText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statusTextActive: {
    color: 'white',
  },
  button: {
    marginTop: 25,
  },
});
