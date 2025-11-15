import {Recipes} from '../models/recipe.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, fileName);
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
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

// Add new recipe
export const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    // console.log('Body:', req.body);
    // console.log('File:', req.file);
    // console.log('File:', req.user);

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

    // Create new recipe without authentication (temporary)
    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      data: newRecipe
    });
  } catch (error) {
    // Delete uploaded file if recipe creation fails
    if (req.file) {
      const filePath = path.join('./public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Error creating recipe',
      error: error.message
    });
  }
};

// Edit existing recipe
export const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, time } = req.body;

    // Find existing recipe
    const recipe = await Recipes.findById(id);

    if (!recipe) {
      // Delete uploaded file if recipe not found
      if (req.file) {
        const filePath = path.join('./public/images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Delete old image if new one is uploaded
    if (req.file && recipe.coverImage) {
      const oldImagePath = path.join('./public/images', recipe.coverImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Determine which image to use
    const coverImage = req.file?.filename || recipe.coverImage;

    // Update recipe
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      id,
      {
        title: title || recipe.title,
        ingredients: ingredients || recipe.ingredients,
        instructions: instructions || recipe.instructions,
        time: time || recipe.time,
        coverImage
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      const filePath = path.join('./public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Error updating recipe',
      error: error.message
    });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find recipe
    const recipe = await Recipes.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Delete recipe
    const deletedRecipe = await Recipes.findByIdAndDelete(id);

    // Delete associated image file
    if (deletedRecipe.coverImage) {
      const imagePath = path.join('./public/images', deletedRecipe.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      message: 'Recipe deleted successfully',
      data: deletedRecipe
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting recipe',
      error: error.message
    });
  }
};