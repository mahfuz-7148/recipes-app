import express from 'express';
import {getUser, userLogin, userSignup} from '../controllers/user.js';

export const router = express.Router()

router.post('/signup', userSignup)
router.post('/login', userLogin)
router.get('/user/:id', getUser)