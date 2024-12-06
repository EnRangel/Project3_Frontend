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

  // Define fetchUserData outside of useEffect
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

  // Call fetchUserData inside useEffect for initial load
  useEffect(() => {
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
    // Check if password is provided
    if (!formData.password || formData.password.trim() === '') {
      setError('Password is required to update the profile.');
      return;
    }
  
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
        setFormData((prev) => ({ ...prev, password: '' })); // Clear password after successful update
  
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
        <Button title="Retry" onPress={() => {
          setError(''); // Clear the error message
          fetchUserData(); // Retry fetching user data
        }} />
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
              placeholder="Password (required)"
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
                style={styles.recipeContainer}
              >
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription}>{recipe.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('Details', { recipeId: recipe.id })}
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noFavorites}>You have no favorite recipes yet.</Text>
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
    backgroundColor: '#f7f8fa',
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
    color: '#34495e',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#2c3e50',
  },
  recipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeContent: {
    flex: 1,
    marginRight: 12,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4285F4',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailsButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: '#ecf0f1',
  },
  info: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 12,
  },
  success: {
    color: '#27ae60',
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  noFavorites: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 12,
  },
});
