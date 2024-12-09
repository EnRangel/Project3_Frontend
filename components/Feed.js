import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Feed = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://10.0.2.2:8080/recipes/all', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const sortedRecipes = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecipes(sortedRecipes);
      setFilteredRecipes(sortedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Use `useFocusEffect` to refresh recipes whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) => {
        const dietaryTags = recipe.dietaryTags || [];
        return (
          recipe.title.toLowerCase().includes(text.toLowerCase()) ||
          dietaryTags.some((tag) => tag.toLowerCase().includes(text.toLowerCase()))
        );
      });
      setFilteredRecipes(filtered);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('Details', { recipeId: item.id })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeDetails}>
        Created At: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.recipeDetails}>
        Dietary Tags: {item.dietaryTags?.join(', ') || 'None'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Recipes</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by name or dietary tags..."
        value={search}
        onChangeText={handleSearch}
      />
      {filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noResults}>No recipes found.</Text>
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  recipeItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  recipeImage: { width: '100%', height: 150, borderRadius: 5, marginBottom: 8 },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: { fontSize: 14, color: '#fff' },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  recipeDetails: { fontSize: 14, marginVertical: 2 },
  noResults: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
  error: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
