import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Install this if not already

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out both fields.', [{ text: 'OK' }]);
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // For cookies and session storage
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(data.user)); // Save user info
        Alert.alert('Login Successful', `Welcome, ${data.user.username}`, [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home', { user: data.user }),
          },
        ]);
      } else {
        const data = await response.json();
        Alert.alert('Login Failed', data.message || 'Invalid credentials', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Link to Sign Up page */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    fontSize: 14,
    color: '#4285F4',
    marginLeft: 5,
  },
});
