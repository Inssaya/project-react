import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateMajorScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
    if (!name || !schoolId) {
      Alert.alert('Error', 'Major name and School are required');
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
      const res = await fetch(`${BASE_URL}/majors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          name: name,
          description: description || null,
          school_id: schoolId
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', json.message || 'Major created successfully');
        router.back();
      } else {
        Alert.alert('Error', json.message || 'Failed to create major');
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
        <Text style={styles.title}>Create Major/Department</Text>
        
        <Text style={styles.label}>Major Name *</Text>
        <TextInput 
          style={styles.input}
          value={name} 
          onChangeText={setName}
          placeholder="e.g., Computer Science, Mathematics"
          editable={!loading}
        />
        
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={description} 
          onChangeText={setDescription}
          placeholder="Enter major description"
          multiline
          numberOfLines={3}
          editable={!loading}
        />
        
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
            <Button title="Create Major" onPress={submit} />
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