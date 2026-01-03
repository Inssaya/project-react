import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateTeacherScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [subjects, setSubjects] = useState('');

  const submit = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    try {
      const res = await fetch(`${BASE_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ user_id: userId, school_id: schoolId, subjects: subjects.split(',') }),
      });
      const json = await res.json();
      Alert.alert('Create Teacher', JSON.stringify(json));
      if (json.success) navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>User ID</Text>
      <TextInput value={userId} onChangeText={setUserId} />
      <Text>School ID</Text>
      <TextInput value={schoolId} onChangeText={setSchoolId} />
      <Text>Subjects (comma separated)</Text>
      <TextInput value={subjects} onChangeText={setSubjects} />
      <Button title="Create" onPress={submit} />
    </View>
  );
}
