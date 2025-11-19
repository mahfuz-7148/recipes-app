import express from 'express';
import {getUser, userLogin, userSignUp} from '../controllers/user.js';

export const router = express.Router()

router.post('/signup', userSignUp)
router.post('/login', userLogin)
router.get('/user/:id', getUser)