import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { BASE_URL } from '../config';

export default function DashboardScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('myschools_token');
      const u = await AsyncStorage.getItem('myschools_user');
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    })();
  }, []);

  const listSchools = async () => {
    try {
      const res = await fetch(`${BASE_URL}/schools`, { headers: { Authorization: 'Bearer ' + token } });
      const json = await res.json();
      if (json.success) setSchools(json.data || []);
      else Alert.alert('Error', JSON.stringify(json));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Dashboard</Text>
      <Text>Logged as: {user ? user.full_name : 'unknown'}</Text>
      <Text>Role: {user ? user.role : 'unknown'}</Text>

      <Button title="List Schools" onPress={listSchools} />
      <FlatList data={schools} keyExtractor={(i) => i.id} renderItem={({ item }) => <Text>{item.name} - {item.address}</Text>} />

      {user && user.role === 'admin' && (
        <>
          <Button title="Create School" onPress={() => navigation.navigate('CreateSchool')} />
          <Button title="Create Teacher" onPress={() => navigation.navigate('CreateTeacher')} />
        </>
      )}

      {user && user.role === 'teacher' && (
        <>
          <Button title="Create Class" onPress={() => navigation.navigate('CreateClass')} />
          <Button title="Record Attendance" onPress={() => navigation.navigate('RecordAttendance')} />
        </>
      )}

      {user && user.role === 'student' && (
        <Text>Students can view attendance (not implemented in UI).</Text>
      )}
    </View>
  );
}
