import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function CreateClassScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [majorId, setMajorId] = useState('');
  const [year, setYear] = useState('');
  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    const token = await AsyncStorage.getItem('myschools_token');
    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.replace('/Login');
      return;
    }

    try {
      // Fetch schools
      const schoolsRes = await fetch(`${BASE_URL}/schools`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const schoolsJson = await schoolsRes.json();
      if (schoolsRes.ok) {
        setSchools(schoolsJson.data || []);
      }

      // Fetch majors
      const majorsRes = await fetch(`${BASE_URL}/majors`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const majorsJson = await majorsRes.json();
      if (majorsRes.ok) {
        setMajors(majorsJson.data || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const submit = async () => {
    if (!name || !schoolId) {
      Alert.alert('Error', 'Class name and School are required');
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
      const res = await fetch(`${BASE_URL}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ 
          name: name,
          school_id: schoolId,
          major_id: majorId || null,
          year: year || null
        }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert('Success', json.message || 'Class created successfully');
        router.back();
      } else {
        Alert.alert('Error', json.message || 'Failed to create class');
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
        <Text style={styles.title}>Create Class</Text>
        
        <Text style={styles.label}>Class Name *</Text>
        <TextInput 
          style={styles.input}
          value={name} 
          onChangeText={setName}
          placeholder="e.g., 10-A, Grade 11"
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
        
        <Text style={styles.label}>Major (Optional)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={majorId}
            onValueChange={(value) => setMajorId(value)}
            enabled={!loading}
          >
            <Picker.Item label="-- Select Major --" value="" />
            {majors.map((major) => (
              <Picker.Item 
                key={major.id} 
                label={major.name || major.major_name} 
                value={major.id} 
              />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.label}>Year (Optional)</Text>
        <TextInput 
          style={styles.input}
          value={year} 
          onChangeText={setYear}
          placeholder="e.g., 2024"
          editable={!loading}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <View style={styles.button}>
            <Button title="Create Class" onPress={submit} />
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
