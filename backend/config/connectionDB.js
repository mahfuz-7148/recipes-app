import mongoose from 'mongoose';

const connectionDB = async () => {
  // যদি already connected থাকে, নতুন করে connect করবে না
  if (mongoose.connections[0].readyState) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.CONNECTION_DB, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectionDB;