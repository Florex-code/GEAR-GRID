import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};
