import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/api/users/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user session.');
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
        navigation.replace('Login');
      }
    };

    fetchUserSession();
  }, [navigation]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.username}!</Text>
      <Text style={styles.subtitle}>
        Explore and share recipes with the community. Discover new flavors and connect with food lovers.
      </Text>

      {/* Centered Side-by-Side Boxes */}
      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('Feed')}
        >
          <Text style={styles.boxIcon}>🍴</Text>
          <Text style={styles.boxTitle}>Explore Recipes</Text>
          <Text style={styles.boxDescription}>Find recipes from around the world.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('RecipeForm')}
        >
          <Text style={styles.boxIcon}>📖</Text>
          <Text style={styles.boxTitle}>Share a Recipe</Text>
          <Text style={styles.boxDescription}>Contribute your favorite recipes to the community.</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  box: {
    width: '40%', // Adjusted to fit two boxes side by side
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  boxIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  boxDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});
