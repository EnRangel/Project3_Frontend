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
  TouchableOpacity,
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

      navigation.navigate('Feed');
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              setCommentToEdit(item);
              setEditCommentContent(item.content);
              setShowEditCommentModal(true);
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              setCommentToDelete(item);
              setShowDeleteCommentModal(true);
            }}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
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
        data={comments.slice().reverse()} // Reverse comments for newest to appear last
        renderItem={renderComment}
        keyExtractor={(item, index) => item.id || index.toString()}

        // css for 
        ListHeaderComponent={


          <View style={styles.detailsContainer}>

      <Text style={styles.title}>{recipe?.title}</Text>
                  <Image
          source={
            recipe?.imageUrl && recipe?.imageUrl.trim() !== ""
              ? { uri: recipe.imageUrl }
              : require('./image.png') // Default to local image.png
          }
          style={styles.image}
        />

        <Text style={styles.text}>
              <Text style={styles.label}>Posted by:</Text> {recipe?.ownerUsername || 'Unknown User'}
            </Text>


           
        
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
              <Text style={styles.label}>Favorites:</Text> {recipe?.favoritesCount || 0}
            </Text>
        
           
        
            <View style={styles.buttonContainer}>
              {isFavorite ? (
                <TouchableOpacity
                  style={[styles.button, styles.favoriteButton]}
                  onPress={handleRemoveFromFavorites}
                >
                  <Text style={styles.buttonText}>Unfavorite</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.favoriteButton]}
                  onPress={handleAddToFavorites}
                >
                  <Text style={styles.buttonText}>Favorite</Text>
                </TouchableOpacity>
              )}
        
              {recipe?.ownerId === loggedInUserId && (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => setShowEditRecipeModal(true)}
                  >
                    <Text style={styles.buttonText}>Edit Recipe</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => setShowDeleteRecipeModal(true)}
                  >
                    <Text style={styles.buttonText}>Delete Recipe</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        }
        


        ListFooterComponent={
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity 
              style={styles.footerButton} 
              onPress={() => setShowAddCommentModal(true)}
            >
              <Text style={styles.footerButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        }
        
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
        }
        />
  


    {/* Add Comment Modal */}
<Modal visible={showAddCommentModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Add your comment..."
        value={newComment}
        onChangeText={setNewComment}
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
          <Text style={styles.modalButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={() => setShowAddCommentModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Edit Comment Modal */}
<Modal visible={showEditCommentModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Edit your comment..."
        value={editCommentContent}
        onChangeText={setEditCommentContent}
      />
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalButton} onPress={handleEditComment}>
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={() => setShowEditCommentModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Delete Comment Modal */}
<Modal visible={showDeleteCommentModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Confirm Delete</Text>
      <Text>Are you sure you want to delete this comment?</Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={handleDeleteComment}
        >
          <Text style={styles.modalButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowDeleteCommentModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


     
    {/* Edit Recipe Modal */}
<Modal visible={showEditRecipeModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Recipe</Text>
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
            ? editRecipeData.dietaryTags.join(', ') 
            : recipe?.dietaryTags?.join(', ') || '' 
        }
        onChangeText={(text) =>
          setEditRecipeData((prev) => ({
            ...prev,
            dietaryTags: text ? text.split(',').map((tag) => tag.trim()) : [],
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
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={styles.modalButton} onPress={handleEditRecipe}>
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={() => setShowEditRecipeModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Delete Recipe Modal */}
<Modal visible={showDeleteRecipeModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Delete Recipe</Text>
      <Text>Are you sure you want to delete this recipe?</Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={handleDeleteRecipe}
        >
          <Text style={styles.modalButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowDeleteRecipeModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </KeyboardAvoidingView>
  );
};
export default Details;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f7f8fa', 
    padding: 16, 
  },
  detailsContainer: { 
    padding: 16, 
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    textAlign: 'center', 
    marginBottom: 12,
  },
  text: { 
    fontSize: 16, 
    marginVertical: 4, 
    color: '#34495e', 
    lineHeight: 22,
  },
  label: { 
    fontWeight: 'bold', 
    color: '#2c3e50',
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode: 'cover',
  },
  comment: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
    backgroundColor: '#fdfdfd',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  commentMeta: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  favoriteButton: {
    backgroundColor: '#2ecc71',
  },
  unfavoriteButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 10,
    width: '100%',
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#3498db',
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#e74c3c',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyComments: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 16,
    fontSize: 16,
  },



  footerButtonContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#3498db', // Light blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 16,
    fontSize: 16,
  },
});
