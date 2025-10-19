import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectionDB.js';
import recipes from './routes/recipe.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/recipe', recipes);

app.listen(port, (err) => {
  console.log(`app is listening on port ${port}`);
});