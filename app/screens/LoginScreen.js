import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from '../config';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorDetails(''); // Clear previous errors
    
    try {
      console.log('🔄 Attempting login...');
      console.log('📧 Email:', email);
      console.log('🌐 API URL:', `${BASE_URL}/auth/login`);
      
      // Test if we can reach the server first
      const healthCheck = await fetch(`${BASE_URL.replace('/api', '')}`, {
        method: 'GET',
      }).catch(err => {
        throw new Error(`Cannot reach backend server at ${BASE_URL}

Details: ${err.message}

Make sure backend is running on port 3001`);
      });
      
      console.log('✅ Backend server is reachable');
      
      // Now try to login
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📥 Response status:', res.status);
      console.log('📥 Response headers:', JSON.stringify(res.headers));
      
      // Try to parse response
      let json;
      try {
        const text = await res.text();
        console.log('📄 Raw response:', text);
        json = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Server returned invalid JSON\n\nStatus: ${res.status}\nError: ${parseErr.message}`);
      }
      
      console.log('📦 Parsed response:', JSON.stringify(json));
      
      if (json.success && json.data && json.data.token) {
        console.log('✅ Login successful!');
        await AsyncStorage.setItem('myschools_token', json.data.token);
        if (json.data.user) {
          await AsyncStorage.setItem('myschools_user', JSON.stringify(json.data.user));
        }
        Alert.alert('Success! 🎉', 'Logged in successfully');
        router.replace('/Dashboard');
      } else {
        // Login failed with valid response
        const errorMsg = json.message || 'Invalid credentials';
        const detailedError = `Login Failed

Reason: ${errorMsg}

Email: ${email}
Status: ${res.status}`;
        console.error('❌ Login failed:', detailedError);
        setErrorDetails(detailedError);
        Alert.alert(
          'Login Failed ❌', 
          `${errorMsg}\n\nPlease check your credentials and try again.`
        );
      }
    } catch (err) {
      // Network or other errors
      console.error('💥 Error during login:', err);
      
      let errorTitle = 'Connection Error';
      let errorMessage = '';
      
      if (err.message.includes('Network request failed')) {
        errorTitle = 'Network Error 🌐';
        errorMessage = `Cannot connect to backend server\n\n` +
          `Backend URL: ${BASE_URL}\n\n` +
          `Possible causes:\n` +
          `1. Backend server is not running\n` +
          `2. Wrong API URL in config\n` +
          `3. CORS issue\n` +
          `4. Firewall blocking connection\n\n` +
          `Solution: Make sure backend is running:\n` +
          `cd backend && npm run dev`;
      } else if (err.message.includes('Failed to fetch')) {
        errorTitle = 'Fetch Failed 🚫';
        errorMessage = `Could not fetch from server\n\n` +
          `URL: ${BASE_URL}/auth/login\n\n` +
          `Error: ${err.message}\n\n` +
          `Check if backend is running on port 3001`;
      } else {
        errorTitle = 'Unexpected Error ⚠️';
        errorMessage = `${err.message}\n\n` +
          `URL: ${BASE_URL}/auth/login\n\n` +
          `Full error: ${err.stack || 'No stack trace'}`;
      }
      
      setErrorDetails(errorMessage);
      Alert.alert(errorTitle, errorMessage, [
        { text: 'Copy Error', onPress: () => console.log('Error:', errorMessage) },
        { text: 'OK' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MySchools Login</Text>
      
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter your email"
        editable={!loading}
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input}
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
        placeholder="Enter your password"
        editable={!loading}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
      ) : (
        <View style={styles.button}>
          <Button title="Login" onPress={submit} />
        </View>
      )}
      
      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>🌐 Backend: {BASE_URL}</Text>
        {errorDetails ? (
          <Text style={styles.errorText}>❌ Last Error: {errorDetails.substring(0, 100)}...</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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
  button: {
    marginTop: 25,
  },
  debugInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 11,
    color: '#dc3545',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});
