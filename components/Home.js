// components/Home.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Home = ({ navigation, route }) => {
  const user = route?.params?.user || { username: 'Guest', email: 'Unknown' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user.username}!</Text>
      <Text style={styles.subtitle}>Email: {user.email}</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});
