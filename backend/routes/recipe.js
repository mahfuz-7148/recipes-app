import express from 'express';
import {getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload} from '../controllers/recipe.js';
import verifyToken from '../middleware/auth.js';

export const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', verifyToken, getRecipe);
router.post('/', upload.single('file'), verifyToken, addRecipe);
router.put('/:id', upload.single('file'), editRecipe);
router.delete('/:id', deleteRecipe);