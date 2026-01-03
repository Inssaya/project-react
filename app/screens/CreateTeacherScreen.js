import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateTeacherScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/schools`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const json = await res.json();
      if (res.ok) {
        setSchools(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const submit = async () => {
    if (!email || !password || !firstName || !lastName || !schoolId) {
      Alert.alert('Error', 'Email, password, first name, last name, and school ID are required');
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
      const res = await fetch(`${BASE_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          school_id: schoolId
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', json.message || 'Teacher account created successfully');
        router.back();
      } else {
        Alert.alert('Error', json.message || 'Failed to create teacher');
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
        <Text style={styles.title}>Create Teacher Account</Text>
        
        <Text style={styles.sectionTitle}>Login Credentials</Text>
        
        <Text style={styles.label}>Email *</Text>
        <TextInput 
          style={styles.input}
          value={email} 
          onChangeText={setEmail}
          placeholder="teacher@example.com"
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
        
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Text style={styles.label}>First Name *</Text>
        <TextInput 
          style={styles.input}
          value={firstName} 
          onChangeText={setFirstName}
          placeholder="Enter first name"
          editable={!loading}
        />
        
        <Text style={styles.label}>Last Name *</Text>
        <TextInput 
          style={styles.input}
          value={lastName} 
          onChangeText={setLastName}
          placeholder="Enter last name"
          editable={!loading}
        />
        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput 
          style={styles.input}
          value={phoneNumber} 
          onChangeText={setPhoneNumber}
          placeholder="Optional"
          keyboardType="phone-pad"
          editable={!loading}
        />
        
        <Text style={styles.sectionTitle}>School Assignment</Text>
        
        <Text style={styles.label}>School *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={schoolId}
            onValueChange={(value) => setSchoolId(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select School --" value="" />
            {schools.map((school) => (
              <Picker.Item 
                key={school.id} 
                label={school.school_name || school.name} 
                value={school.id} 
              />
            ))}
          </Picker>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <View style={styles.button}>
            <Button title="Create Teacher" onPress={submit} />
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
