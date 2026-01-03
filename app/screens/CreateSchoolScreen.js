import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateSchoolScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password || !schoolName) {
      Alert.alert('Error', 'Email, password, and school name are required');
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
      const res = await fetch(`${BASE_URL}/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          email, 
          password, 
          school_name: schoolName, 
          address,
          phone_number: phoneNumber
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', json.message || 'School account created successfully');
        router.back();
      } else {
        Alert.alert('Error', json.message || 'Failed to create school');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create School Account</Text>
        
        <Text style={styles.sectionTitle}>Login Credentials</Text>
        
        <Text style={styles.label}>Email *</Text>
        <TextInput 
          style={styles.input}
          value={email} 
          onChangeText={setEmail}
          placeholder="school@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        
        <Text style={styles.label}>Password *</Text>
        <TextInput 
          style={styles.input}
          value={password} 
          onChangeText={setPassword}
          placeholder="Minimum 6 characters"
          secureTextEntry
          editable={!loading}
        />
        
        <Text style={styles.sectionTitle}>School Information</Text>
        
        <Text style={styles.label}>School Name *</Text>
        <TextInput 
          style={styles.input}
          value={schoolName} 
          onChangeText={setSchoolName}
          placeholder="Enter school name"
          editable={!loading}
        />
        
        <Text style={styles.label}>Address</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={address} 
          onChangeText={setAddress}
          placeholder="Enter school address"
          multiline
          numberOfLines={3}
          editable={!loading}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <View style={styles.button}>
            <Button title="Create School" onPress={submit} />
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
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF',
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
  button: {
    marginTop: 25,
  },
});
