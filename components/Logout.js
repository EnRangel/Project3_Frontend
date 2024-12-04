import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';

const LogoutButton = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      // Make an API call to the backend logout endpoint
      const response = await fetch('http://10.0.3.3:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for session handling
      });

      if (response.ok) {
        Alert.alert('Logout Successful', 'You have been logged out successfully.');
        navigation.replace('Login'); // Replace the current screen with the login screen
      } else {
        const data = await response.json();
        Alert.alert('Logout Failed', data.message || 'Unable to logout. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
});
