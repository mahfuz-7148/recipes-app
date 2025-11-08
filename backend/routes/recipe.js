import express from 'express';
import {getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload} from '../controllers/recipe.js';

export const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', upload.single('file'), addRecipe);
router.put('/:id', upload.single('file'), editRecipe);
router.delete('/:id', deleteRecipe);