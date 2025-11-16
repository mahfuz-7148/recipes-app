import express from 'express';
import {getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload} from '../controllers/recipe.js';
import verifyToken from '../middleware/auth.js';

export const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', verifyToken, upload.single('file'), addRecipe);
router.put('/:id', verifyToken, upload.single('file'), editRecipe);
router.delete('/:id', verifyToken, deleteRecipe);