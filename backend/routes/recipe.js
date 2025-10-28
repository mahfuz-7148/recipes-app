import express from 'express';
import { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe } from '../controllers/recipe.js';

export const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', addRecipe);
router.put('/:id', editRecipe);
router.delete('/:id', deleteRecipe);