import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or DATABASE_URL environment variable');
}

// Connection function
export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Initialize connection
connectDB();

export { mongoose };