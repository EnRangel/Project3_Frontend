// src/services/recipeService.js
export const createRecipe = async (recipe) => {
    console.log('Recipe created:', recipe);
    return new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
};

export const getAllRecipes = async () => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve([
                { id: 1, title: 'Spaghetti Carbonara' },
                { id: 2, title: 'Chicken Alfredo' },
                { id: 3, title: 'Beef Stroganoff' },
            ]);
        }, 1000)
    );
};
