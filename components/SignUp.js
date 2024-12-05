// components/SignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://10.0.2.2:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });
  
      const text = await response.text(); // Read raw response
      const data = text ? JSON.parse(text) : null; // Parse JSON if not empty
  
      if (response.ok) {
        Alert.alert(
          'Account Created',
          'Your account has been successfully created. Please log in to continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'), // Navigate after the alert
            },
          ]
        );
      } else {
        Alert.alert('Sign-Up Failed', data?.message || 'Unable to create an account. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Sign-Up Failed', 'Something went wrong. Please try again later.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    color: '#4285F4',
    marginLeft: 5,
  },
});
