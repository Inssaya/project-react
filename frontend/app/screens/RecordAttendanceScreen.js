import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function RecordAttendanceScreen({ navigation }) {
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState('2025-12-29');
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');

  const submit = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    try {
      const res = await fetch(`${BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ student_id: studentId, class_id: classId, date, status, notes }),
      });
      const json = await res.json();
      Alert.alert('Record Attendance', JSON.stringify(json));
      if (json.success) navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Student ID</Text>
      <TextInput value={studentId} onChangeText={setStudentId} />
      <Text>Class ID</Text>
      <TextInput value={classId} onChangeText={setClassId} />
      <Text>Date (YYYY-MM-DD)</Text>
      <TextInput value={date} onChangeText={setDate} />
      <Text>Status</Text>
      <TextInput value={status} onChangeText={setStatus} />
      <Text>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} />
      <Button title="Record" onPress={submit} />
    </View>
  );
}
