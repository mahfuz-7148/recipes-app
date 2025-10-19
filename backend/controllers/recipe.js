import Recipes from '../models/recipe.js';

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.json({
      message: 'Recipes fetched successfully',
      data: recipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({
      message: 'Recipe fetched successfully',
      data: recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

export const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      data: newRecipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

export const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, time } = req.body;
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      id,
      {
        title,
        ingredients,
        instructions,
        time
      },
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipes.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({
      message: 'Recipe deleted successfully',
      data: deletedRecipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};