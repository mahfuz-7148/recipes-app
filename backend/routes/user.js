import express from 'express';
import {getUser, uploadPhoto, userLogin, userSignUp} from '../controllers/user.js';

export const router = express.Router()

router.post('/signUp', uploadPhoto.single('photo'), userSignUp);
router.post('/login', userLogin)
router.get('/user/:id', getUser)