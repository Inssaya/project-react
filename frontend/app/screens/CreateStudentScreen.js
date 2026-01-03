import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateStudentScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [classId, setClassId] = useState('');
  const [roll, setRoll] = useState('');

  const submit = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    try {
      const res = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ user_id: userId, school_id: schoolId, class_id: classId, roll_number: roll }),
      });
      const json = await res.json();
      Alert.alert('Create Student', JSON.stringify(json));
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
      <Text>Class ID</Text>
      <TextInput value={classId} onChangeText={setClassId} />
      <Text>Roll number</Text>
      <TextInput value={roll} onChangeText={setRoll} />
      <Button title="Create" onPress={submit} />
    </View>
  );
}
