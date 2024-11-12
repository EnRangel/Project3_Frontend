import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    recipeName: '',
    ingredients: '',
    instructions: '',
    dietaryTags: '',
    imageUrl: ''
  });

  const [posts, setPosts] = useState([]); 

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePostSubmit = () => {

    setPosts([
      ...posts,
      {
        id: posts.length + 1,
        recipeName: formData.recipeName,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        dietaryTags: formData.dietaryTags,
        imageUrl: formData.imageUrl
      }
    ]);
    setModalVisible(false);
    setFormData({
      recipeName: '',
      ingredients: '',
      instructions: '',
      dietaryTags: '',
      imageUrl: ''
    });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postBox}>
      <Text style={styles.postTitle}>{item.recipeName}</Text>
      <Text style={styles.postText}>Ingredients: {item.ingredients}</Text>
      <Text style={styles.postText}>Instructions: {item.instructions}</Text>
      <Text style={styles.postText}>Dietary Tags: {item.dietaryTags}</Text>
      {item.imageUrl ? <Text style={styles.postText}>Image URL: {item.imageUrl}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.horizontalLine} />


      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postsList}
      />


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a Post</Text>


            <TextInput
              style={styles.input}
              placeholder="Recipe Name"
              value={formData.recipeName}
              onChangeText={(text) => handleInputChange('recipeName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingredients"
              value={formData.ingredients}
              onChangeText={(text) => handleInputChange('ingredients', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Instructions"
              value={formData.instructions}
              onChangeText={(text) => handleInputChange('instructions', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Dietary Tags"
              value={formData.dietaryTags}
              onChangeText={(text) => handleInputChange('dietaryTags', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={formData.imageUrl}
              onChangeText={(text) => handleInputChange('imageUrl', text)}
            />

            <TouchableOpacity style={styles.button} onPress={handlePostSubmit}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  horizontalLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  postsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postBox: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#808080',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
});
