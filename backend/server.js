import express from 'express';
import connectDB from './config/connectionDB.js';
import {router as recipes} from './routes/recipe.js';
import cors from 'cors';
import {router as users} from './routes/user.js';

const app = express();
const port = process.env.PORT || 3000;

connectDB().then(() => console.log('connected db')).catch((err) => console.error('DB connection error:', err));

app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));

app.use('/', users)
app.use('/recipe', recipes);

app.listen(port, (err) => {
  console.log(`app is listening on port ${port}`);
});





// import express from 'express';
// import connectDB from './config/connectionDB.js';
// import {router as recipes} from './routes/recipe.js';
// import cors from 'cors';
// import {router as users} from './routes/user.js';
//
// const app = express();
// const port = process.env.PORT || 3000;
//
// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use('/public', express.static('public'));
//
// // Database connection with caching for serverless
// let isConnected = false;
//
// async function ensureDbConnection() {
//   if (isConnected) {
//     return;
//   }
//
//   try {
//     await connectDB();
//     isConnected = true;
//     console.log('Connected to DB');
//   } catch (err) {
//     console.error('DB connection error:', err);
//     throw err;
//   }
// }
//
// // Connect to DB before handling requests
// app.use(async (req, res, next) => {
//   try {
//     await ensureDbConnection();
//     next();
//   } catch (err) {
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });
//
// // Routes
// app.use('/', users);
// app.use('/recipe', recipes);
//
// // Health check route
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', message: 'API is running' });
// });
//
// // Only listen on port in local development
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(port, () => {
//     console.log(`App is listening on port ${port}`);
//   });
// }
//
// // Export for Vercel serverless
// export default app;