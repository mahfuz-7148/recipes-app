import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectionDB.js';
import {router as recipes} from './routes/recipe.js';
import cors from 'cors';
import {router as users} from './routes/user.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB().then(() => console.log('connected db')).catch((err) => console.error('DB connection error:', err));

app.use(express.json());
app.use(cors());

app.use('/', users)
app.use('/recipe', recipes);

app.listen(port, (err) => {
  console.log(`app is listening on port ${port}`);
});