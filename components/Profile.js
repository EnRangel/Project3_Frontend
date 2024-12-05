import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/api/users/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFavorites(userData.favorites || []);
          setFormData({
            username: userData.username,
            email: userData.email,
            password: '',
          });
        } else {
          throw new Error('Failed to load user profile.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please log in again.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Alert.alert('Logout Successful', 'You have been logged out successfully.');
        navigation.replace('Login');
      } else {
        throw new Error('Failed to log out.');
      }
    } catch (err) {
      console.error('Error logging out:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/users/${user.id}/update-info`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message || 'Profile updated successfully!');
        setUser((prev) => ({
          ...prev,
          username: formData.username,
          email: formData.email,
        }));
        setIsEditing(false);

        // Clear the success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Go to Login" onPress={() => navigation.replace('Login')} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditToggle} style={styles.button}>
          <Text style={styles.buttonText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContent}>
        <Text style={styles.title}>Hello {user.username}, here’s your profile!</Text>
        {isEditing ? (
          <View>
            {error && <Text style={styles.error}>{error}</Text>}
            {successMessage && <Text style={styles.success}>{successMessage}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
            />
            <Button title="Save Changes" onPress={handleUpdateProfile} />
          </View>
        ) : (
          <View>
            <Text>Email: <Text style={styles.info}>{user.email}</Text></Text>
            <Text style={styles.subTitle}>Your Favorites:</Text>
            {favorites.length > 0 ? (
              favorites.map((recipe, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('Details', { recipeId: recipe.id })}
                  style={styles.recipe}
                >
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text>{recipe.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>You have no favorite recipes yet.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  recipe: {
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    flexDirection: 'column', // Ensure content stacks properly if needed
  },
  recipeTitle: {
    fontWeight: 'bold',
    color: '#4285F4',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
  },
  info: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  success: {
    color: 'green',
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
