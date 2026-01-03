import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      Alert.alert('Login', JSON.stringify(json));
      if (json.success && json.data && json.data.token) {
        await AsyncStorage.setItem('myschools_token', json.data.token);
        if (json.data.user) await AsyncStorage.setItem('myschools_user', JSON.stringify(json.data.user));
        navigation.replace('Dashboard');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={submit} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
