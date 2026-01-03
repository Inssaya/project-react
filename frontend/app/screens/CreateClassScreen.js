import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateClassScreen({ navigation }) {
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const submit = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    try {
      const res = await fetch(`${BASE_URL}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name, school_id: schoolId, teacher_id: teacherId }),
      });
      const json = await res.json();
      Alert.alert('Create Class', JSON.stringify(json));
      if (json.success) navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Class name</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>School ID</Text>
      <TextInput value={schoolId} onChangeText={setSchoolId} />
      <Text>Teacher ID</Text>
      <TextInput value={teacherId} onChangeText={setTeacherId} />
      <Button title="Create" onPress={submit} />
    </View>
  );
}
