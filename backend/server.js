import express from 'express';
import connectDB from './config/connectionDB.js';
import { router as recipes } from './routes/recipe.js';
import cors from 'cors';
import { router as users } from './routes/user.js';

const app = express();
const port = process.env.PORT || 3000;

// Database connection with caching
let isConnected = false;

const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connected');
    } catch (err) {
      console.error('DB connection error:', err);
      throw err;
    }
  }
};

// Middleware
app.use(express.json());
app.use(cors());

// Static files আর দরকার নেই (Cloudinary use করছি)
// app.use('/public', express.static('public'));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (err) {
    res.status(500).json({
      error: 'Database connection failed',
      message: err.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/', users);
app.use('/recipe', recipes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}

// Export for Vercel
export default app;