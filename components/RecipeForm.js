import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
                credentials: 'include',
                body: JSON.stringify({
                    title: title.trim(),
                    ingredients: ingredients.trim(),
                    instructions: instructions.trim(),
                    dietaryTags: dietaryTags
                        ? dietaryTags.split(',').map((tag) => tag.trim())
                        : [],
                    imageUrl: imageUrl.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to create recipe');
            }

            const result = await response.json();
            Alert.alert('Success', `Recipe created: ${result.recipe?.title || ''}`, [
                { text: 'OK', onPress: () => navigation.navigate('Feed') }, // Navigate to Feed after success
            ]);
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
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Recipe</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RecipeForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f8fa', // Subtle light gray for a professional look
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#34495e', // Neutral dark color for text
    },
    input: {
        height: 50,
        borderColor: '#dcdcdc', // Light border color
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff', // White background for contrast
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Light shadow for depth
        fontSize: 16, // Readable font size
    },
    textArea: {
        height: 120,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#2ecc71', // Green for submit button
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff', // White text for contrast
        fontSize: 18,
        fontWeight: 'bold',
    },
});
