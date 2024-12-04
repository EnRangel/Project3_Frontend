import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const Feed = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://10.0.2.2:8080/recipes/all', {
          method: 'GET',
        });
        const data = await response.json();
        console.log('API Response:', data);
        setRecipes(data);
        setFilteredRecipes(data); // Initialize with full list
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(text.toLowerCase()) ||
        recipe.dietaryTags?.some((tag) =>
          tag.toLowerCase().includes(text.toLowerCase())
        )
      );
      setFilteredRecipes(filtered);
    }
  };

  const renderRecipe = ({ item }) => {
    console.log('Recipe ID:', item.id || item._id); // Log recipe ID
    return (
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() =>
          navigation.navigate('Details', { recipeId: item.id || item._id })
        }
      >
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
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
          keyExtractor={(item) => item.id || item._id} // Use id or _id as the key
        />
      ) : (
        <Text style={styles.noResults}>No recipes found.</Text>
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
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
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
