// src/components/screens/Home.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Recipe Sharing App!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Explore Recipes!')}
      >
        <Text style={styles.buttonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
