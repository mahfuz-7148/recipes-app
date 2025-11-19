import { Recipes } from '../models/recipe.js';
import multer from 'multer';
import path from 'path';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinaryHelper.js';

// Multer configuration - Memory storage for Vercel
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র image files allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find().sort({ createdAt: -1 });
    res.json({
      message: 'Recipes fetched successfully',
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching recipes',
      error: error.message
    });
  }
};

// Get single recipe by ID
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
    res.status(500).json({
      message: 'Error fetching recipe',
      error: error.message
    });
  }
};

// Add new recipe with Cloudinary upload
export const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    // Validate required fields
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Title, ingredients, and instructions are required"
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Recipe image is required"
      });
    }

    // Upload image to Cloudinary
    console.log('Uploading to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'food-recipes');

    console.log('Cloudinary upload successful:', cloudinaryResult.secure_url);

    // Create new recipe with Cloudinary URL
    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time,
      coverImage: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      data: newRecipe
    });
  } catch (error) {
    console.error('Add recipe error:', error);
    res.status(500).json({
      message: 'Error creating recipe',
      error: error.message
    });
  }
};

// Edit existing recipe with Cloudinary
export const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, time } = req.body;

    // Find existing recipe
    const recipe = await Recipes.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    let coverImage = recipe.coverImage;
    let cloudinaryId = recipe.cloudinaryId;

    // If new image is uploaded
    if (req.file) {
      console.log('New image uploaded, updating Cloudinary...');

      // Delete old image from Cloudinary
      if (recipe.cloudinaryId) {
        console.log('Deleting old image:', recipe.cloudinaryId);
        await deleteFromCloudinary(recipe.cloudinaryId);
      }

      // Upload new image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'food-recipes');
      coverImage = cloudinaryResult.secure_url;
      cloudinaryId = cloudinaryResult.public_id;

      console.log('New image uploaded:', coverImage);
    }

    // Update recipe
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      id,
      {
        title: title || recipe.title,
        ingredients: ingredients || recipe.ingredients,
        instructions: instructions || recipe.instructions,
        time: time || recipe.time,
        coverImage,
        cloudinaryId
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Edit recipe error:', error);
    res.status(500).json({
      message: 'Error updating recipe',
      error: error.message
    });
  }
};

// Delete recipe with Cloudinary cleanup
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find recipe
    const recipe = await Recipes.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Delete image from Cloudinary
    if (recipe.cloudinaryId) {
      console.log('Deleting image from Cloudinary:', recipe.cloudinaryId);
      await deleteFromCloudinary(recipe.cloudinaryId);
    }

    // Delete recipe from database
    const deletedRecipe = await Recipes.findByIdAndDelete(id);

    res.json({
      message: 'Recipe deleted successfully',
      data: deletedRecipe
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      message: 'Error deleting recipe',
      error: error.message
    });
  }
};