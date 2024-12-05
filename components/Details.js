import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

const Details = ({ route, navigation }) => {
  const { recipeId } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editRecipeData, setEditRecipeData] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [showDeleteRecipeModal, setShowDeleteRecipeModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    try {
      const [recipeRes, commentsRes, userRes] = await Promise.all([
        fetch(`http://10.0.2.2:8080/recipes/${recipeId}/details`, { credentials: 'include' }),
        fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments`, { credentials: 'include' }),
        fetch(`http://10.0.2.2:8080/api/users/session`, { credentials: 'include' }),
      ]);

      if (![recipeRes, commentsRes, userRes].every((res) => res.ok)) {
        throw new Error('Failed to fetch data');
      }

      const [recipeData, commentsData, userData] = await Promise.all([
        recipeRes.json(),
        commentsRes.json(),
        userRes.json(),
      ]);

      // Handle dietaryTags if it's a string
      const dietaryTags = Array.isArray(recipeData.dietaryTags)
      ? recipeData.dietaryTags
      : recipeData.dietaryTags
      ? recipeData.dietaryTags.split(',').map((tag) => tag.trim())
      : [];
    
      setRecipe({
        ...recipeData,
        dietaryTags: dietaryTags, // Ensure dietaryTags is an array
      });
      setComments(commentsData);
      setLoggedInUserId(userData.id);
      setIsFavorite(userData.favorites.some((fav) => fav.id === recipeId));

      console.log('Fetched Recipe Details:', recipeData);
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      setError('Failed to load recipe details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  // Function to fetch comments
const fetchComments = async () => {
  try {
    const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments.');
    }

    const commentsData = await response.json();
    setComments(commentsData); // Update the comments state
    console.log('Comments updated:', commentsData);
  } catch (err) {
    console.error('Error fetching comments:', err);
    Alert.alert('Error', 'Could not refresh comments.');
  }
};

const handleAddComment = async () => {
  if (!newComment.trim()) {
    Alert.alert('Error', 'Comment cannot be empty.');
    return;
  }

  try {
    const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment.');
    }

    // Fetch the updated comments list
    const commentsResponse = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments`, {
      credentials: 'include',
    });

    if (!commentsResponse.ok) {
      throw new Error('Failed to fetch updated comments.');
    }

    const updatedComments = await commentsResponse.json();
    setComments(updatedComments); // Update the comments list
    setNewComment(''); // Clear the input field
    setShowAddCommentModal(false); // Close the modal
  } catch (err) {
    console.error('Error adding comment:', err);
    Alert.alert('Error', 'Could not add comment.');
  }
};


  

  const handleEditComment = async () => {
    if (!editCommentContent.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments/${commentToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit comment.');
      }

      setEditCommentContent('');
      setShowEditCommentModal(false);
      await fetchRecipeDetails(); // Refresh comments
    } catch (err) {
      console.error('Error editing comment:', err);
      Alert.alert('Error', 'Could not edit comment.');
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/comments/${commentToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment.');
      }

      setShowDeleteCommentModal(false);
      await fetchRecipeDetails(); // Refresh comments
    } catch (err) {
      console.error('Error deleting comment:', err);
      Alert.alert('Error', 'Could not delete comment.');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/favorites`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to add recipe to favorites.');
      }
  
      // Ensure favoritesCount is treated as a number
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        favoritesCount: (parseInt(prevRecipe.favoritesCount, 10) || 0) + 1,
      }));
      setIsFavorite(true);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      Alert.alert('Error', 'Could not add recipe to favorites.');
    }
  };
  
  
  
  

  const handleRemoveFromFavorites = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}/favorites`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove recipe from favorites.');
      }
  
      // Update the local state for favorites
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        favoritesCount: Math.max((prevRecipe.favoritesCount || 1) - 1, 0),
      }));
      setIsFavorite(false);
    } catch (err) {
      console.error('Error removing from favorites:', err);
      Alert.alert('Error', 'Could not remove recipe from favorites.');
    }
  };
  
  
  
  
  const handleEditRecipe = async () => {
    if (recipe?.ownerId !== loggedInUserId) {
      Alert.alert('Error', 'You are not authorized to edit this recipe.');
      return;
    }
  
    try {
      // Ensure dietaryTags is properly processed
      const updatedData = {
        ...editRecipeData,
        dietaryTags: Array.isArray(editRecipeData.dietaryTags)
          ? editRecipeData.dietaryTags.join(', ') // Convert array to string
          : recipe?.dietaryTags?.join(', ') || '', // Fallback to existing recipe tags
      };
  
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to edit recipe. Details: ${errorDetails}`);
      }
  
      // Fetch updated recipe details
      await fetchRecipeDetails();
  
      // Reset modal and edit data
      setEditRecipeData({});
      setShowEditRecipeModal(false);
      Alert.alert('Success', 'Recipe updated successfully!');
    } catch (err) {
      console.error('Error editing recipe:', err);
      Alert.alert('Error', 'Could not edit recipe. Please try again.');
    }
  };
  
  
  
  
  
  

  const handleDeleteRecipe = async () => {
    if (recipe?.ownerId !== loggedInUserId) {
      Alert.alert('Error', 'You are not authorized to delete this recipe.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8080/recipes/${recipeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe.');
      }

      navigation.navigate('RecipeList');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      Alert.alert('Error', 'Could not delete recipe.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentMeta}>
        Posted by: {item.username || 'Anonymous'}
      </Text>
      <Text style={styles.commentMeta}>
        Posted on: {new Date(item.createdAt).toLocaleString()}
      </Text>
      {item.editedAt && item.editedAt !== item.createdAt && (
        <Text style={styles.commentMeta}>
          Edited on: {new Date(item.editedAt).toLocaleString()}
        </Text>
      )}
      {loggedInUserId === item.userId && (
        <>
          <Button
            title="Edit"
            onPress={() => {
              setCommentToEdit(item);
              setEditCommentContent(item.content);
              setShowEditCommentModal(true);
            }}
          />
          <Button
            title="Delete"
            color="red"
            onPress={() => {
              setCommentToDelete(item);
              setShowDeleteCommentModal(true);
            }}
          />
        </>
      )}
    </View>
  );
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
    <FlatList
  data={comments}
  renderItem={renderComment}
  keyExtractor={(item, index) => item.id || index.toString()} // Ensure unique key for each item
  ListHeaderComponent={
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>{recipe?.title}</Text>
  
      <Text style={styles.text}>
        <Text style={styles.label}>Ingredients:</Text> {recipe?.ingredients}
      </Text>
  
      <Text style={styles.text}>
        <Text style={styles.label}>Instructions:</Text> {recipe?.instructions}
      </Text>
  
      <Text style={styles.text}>
  <Text style={styles.label}>Dietary Tags:</Text>{' '}
  {Array.isArray(recipe?.dietaryTags) && recipe?.dietaryTags.length > 0
    ? recipe?.dietaryTags.join(', ')
    : 'No dietary tags'}
</Text>

  
      <Text style={styles.text}>
        <Text style={styles.label}>Favorites Count:</Text> {recipe?.favoritesCount || 0}
      </Text>
  
      {recipe?.imageUrl && (
        <Image source={{ uri: recipe?.imageUrl }} style={styles.image} />
      )}
  
      {isFavorite ? (
        <Button
          title="Remove from Favorites"
          onPress={handleRemoveFromFavorites}
        />
      ) : (
        <Button
          title="Add to Favorites"
          onPress={handleAddToFavorites}
        />
      )}
  
      {recipe?.ownerId === loggedInUserId && (
        <>
          <Button title="Edit Recipe" onPress={() => setShowEditRecipeModal(true)} />
          <Button title="Delete Recipe" color="red" onPress={() => setShowDeleteRecipeModal(true)} />
        </>
      )}
    </View>
  }
  ListFooterComponent={
    <Button title="Add Comment" onPress={() => setShowAddCommentModal(true)} />
  }
  ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>}
  />
  


      {/* Add Comment Modal */}
      <Modal visible={showAddCommentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add your comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Submit" onPress={handleAddComment} />
          <Button title="Cancel" color="red" onPress={() => setShowAddCommentModal(false)} />
        </View>
      </Modal>

      {/* Edit Comment Modal */}
      <Modal visible={showEditCommentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Edit your comment..."
            value={editCommentContent}
            onChangeText={setEditCommentContent}
          />
          <Button title="Save" onPress={handleEditComment} />
          <Button title="Cancel" color="red" onPress={() => setShowEditCommentModal(false)} />
        </View>
      </Modal>

      {/* Delete Comment Modal */}
      <Modal visible={showDeleteCommentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Are you sure you want to delete this comment?</Text>
          <Button title="Delete" color="red" onPress={handleDeleteComment} />
          <Button title="Cancel" onPress={() => setShowDeleteCommentModal(false)} />
        </View>
      </Modal>

      {/* Edit Recipe Modal */}
      <Modal visible={showEditRecipeModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.label}>Recipe Title</Text>
    <TextInput
      style={styles.input}
      placeholder="Edit Recipe Title"
      value={editRecipeData.title !== undefined ? editRecipeData.title : recipe?.title || ''}
      onChangeText={(text) => setEditRecipeData((prev) => ({ ...prev, title: text }))}
    />
    <Text style={styles.label}>Ingredients</Text>
    <TextInput
      style={styles.input}
      placeholder="Edit Ingredients"
      value={editRecipeData.ingredients !== undefined ? editRecipeData.ingredients : recipe?.ingredients || ''}
      onChangeText={(text) => setEditRecipeData((prev) => ({ ...prev, ingredients: text }))}
    />
    <Text style={styles.label}>Instructions</Text>
    <TextInput
      style={styles.input}
      placeholder="Edit Instructions"
      value={editRecipeData.instructions !== undefined ? editRecipeData.instructions : recipe?.instructions || ''}
      onChangeText={(text) => setEditRecipeData((prev) => ({ ...prev, instructions: text }))}
    />
  <Text style={styles.label}>Dietary Tags</Text>
<TextInput
  style={styles.input}
  placeholder="Edit Dietary Tags (comma-separated)"
  value={
    editRecipeData.dietaryTags !== undefined
      ? editRecipeData.dietaryTags.join(', ') // Convert array to comma-separated string
      : recipe?.dietaryTags?.join(', ') || '' // Fallback to current recipe tags
  }
  onChangeText={(text) =>
    setEditRecipeData((prev) => ({
      ...prev,
      dietaryTags: text ? text.split(',').map((tag) => tag.trim()) : [], // Split string into array
    }))
  }
/>
    <Text style={styles.label}>Image URL</Text>
    <TextInput
      style={styles.input}
      placeholder="Edit Image URL"
      value={editRecipeData.imageUrl !== undefined ? editRecipeData.imageUrl : recipe?.imageUrl || ''}
      onChangeText={(text) => setEditRecipeData((prev) => ({ ...prev, imageUrl: text }))}
    />
    <Button title="Save" onPress={handleEditRecipe} />
    <Button title="Cancel" color="red" onPress={() => setShowEditRecipeModal(false)} />
  </View>
</Modal>




      

      {/* Delete Recipe Modal */}
      <Modal visible={showDeleteRecipeModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Are you sure you want to delete this recipe?</Text>
          <Button title="Delete" color="red" onPress={handleDeleteRecipe} />
          <Button title="Cancel" onPress={() => setShowDeleteRecipeModal(false)} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  detailsContainer: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  text: { fontSize: 16, marginVertical: 4 },
  image: { width: 200, height: 200, marginVertical: 10 },
  comment: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  commentMeta: { fontStyle: 'italic', color: '#555' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, width: '100%', marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default Details;
