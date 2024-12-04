import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dietaryTags, setDietaryTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async () => {
        if (!title || !ingredients || !instructions) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:8080/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include session cookies for authentication
                body: JSON.stringify({
                    title,
                    ingredients, // Send ingredients as a plain string
                    instructions, // Send instructions as a plain string
                    dietaryTags: dietaryTags.split(',').map((tag) => tag.trim()), // Convert to array
                    imageUrl, // Optional image URL
                }),
            });

            if (!response.ok) {
                // Attempt to parse error message from backend
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to create recipe');
            }

            const result = await response.json().catch(() => null);
            if (result) {
                Alert.alert('Success', `Recipe created: ${result.recipe?.title || ''}`, [
                    { text: 'OK', onPress: () => resetForm() },
                ]);
            } else {
                Alert.alert('Success', 'Recipe created successfully!', [
                    { text: 'OK', onPress: () => resetForm() },
                ]);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            Alert.alert('Error', error.message || 'Something went wrong');
        }
    };

    const resetForm = () => {
        setTitle('');
        setIngredients('');
        setInstructions('');
        setDietaryTags('');
        setImageUrl('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add a New Recipe</Text>
            <TextInput
                style={styles.input}
                placeholder="Title (required)"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Ingredients (plain text, required)"
                value={ingredients}
                onChangeText={setIngredients}
            />
            <TextInput
                style={styles.textArea}
                placeholder="Instructions (required)"
                value={instructions}
                onChangeText={setInstructions}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Dietary Tags (comma-separated)"
                value={dietaryTags}
                onChangeText={setDietaryTags}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={imageUrl}
                onChangeText={setImageUrl}
            />
            <Button title="Submit Recipe" onPress={handleSubmit} />
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
        textAlignVertical: 'top',
    },
});
