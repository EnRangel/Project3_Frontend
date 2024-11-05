// src/components/RecipeForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createRecipe } from '../service/RecipeService'; // Mock service function

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleSubmit = async () => {
        if (!title || !ingredients || !instructions) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        await createRecipe({
            title,
            ingredients: ingredients.split(',').map(item => item.trim()), // Split and trim ingredients
            instructions,
        });
        Alert.alert('Success', 'Recipe created!');
        setTitle('');
        setIngredients('');
        setInstructions('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add a New Recipe</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Ingredients (comma-separated)"
                value={ingredients}
                onChangeText={setIngredients}
            />
            <TextInput
                style={styles.textArea}
                placeholder="Instructions"
                value={instructions}
                onChangeText={setInstructions}
                multiline
            />
            <Button title="Add Recipe" onPress={handleSubmit} />
        </View>
    );
};

export default RecipeForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        textAlignVertical: 'top', // Ensures multiline input starts at the top
    },
});
