import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function RecordGradesScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [comments, setComments] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
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

      // Fetch subjects
      const subjectsRes = await fetch(`${BASE_URL}/subjects`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const subjectsJson = await subjectsRes.json();
      if (subjectsRes.ok) {
        setSubjects(subjectsJson.data || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const submit = async () => {
    if (!studentId || !subjectId || !grade || !semester) {
      Alert.alert('Error', 'All fields except comments are required');
      return;
    }

    // Validate grade range
    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 20) {
      Alert.alert('Error', 'Grade must be between 0 and 20');
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

      const res = await fetch(`${BASE_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          student_id: studentId,
          subject_id: subjectId,
          teacher_id: user.id, // Use current user's ID as teacher_id
          semester: semester,
          grade: gradeValue,
          comments: comments || null
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', 'Grade recorded successfully');
        router.back();
      } else {
        Alert.alert('Error', json.message || 'Failed to record grade');
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
        <Text style={styles.title}>Record Student Grade</Text>
        
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
        
        <Text style={styles.label}>Subject *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={subjectId}
            onValueChange={(value) => setSubjectId(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select Subject --" value="" />
            {subjects.map((subject) => (
              <Picker.Item 
                key={subject.id} 
                label={subject.name || subject.subject_name || 'N/A'} 
                value={subject.id} 
              />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.label}>Semester *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={semester}
            onValueChange={(value) => setSemester(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select Semester --" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
        
        <Text style={styles.label}>Grade (0-20) *</Text>
        <TextInput 
          style={styles.input}
          value={grade} 
          onChangeText={setGrade}
          placeholder="Enter grade (e.g., 15.5)"
          keyboardType="numeric"
          editable={!loading}
        />
        
        <Text style={styles.label}>Comments (Optional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={comments} 
          onChangeText={setComments}
          placeholder="Enter any comments about the grade"
          multiline
          numberOfLines={3}
          editable={!loading}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <View style={styles.button}>
            <Button title="Record Grade" onPress={submit} />
          </View>
        )}
      </View>
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
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  button: {
    marginTop: 25,
  },
});