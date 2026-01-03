import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateSchoolScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const submit = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    try {
      const res = await fetch(`${BASE_URL}/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name, address }),
      });
      const json = await res.json();
      Alert.alert('Create School', JSON.stringify(json));
      if (json.success) navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Address</Text>
      <TextInput value={address} onChangeText={setAddress} />
      <Button title="Create" onPress={submit} />
    </View>
  );
}
