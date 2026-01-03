import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../config';

export default function RegisterScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Registration disabled</Text>
      <Text>Account creation is restricted. Please contact an administrator to create teacher or student accounts.</Text>
    </View>
  );
}
