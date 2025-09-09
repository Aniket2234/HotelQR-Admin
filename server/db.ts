import mongoose from 'mongoose';

// For development in Replit, use a local MongoDB connection or skip database initialization
// For production/Vercel, use environment variable
const MONGODB_URI = process.env.MONGODB_URI || 
                   (process.env.NODE_ENV === 'production' 
                     ? undefined 
                     : 'mongodb+srv://abhijeet18012001:SCeJSjgqac7DmdS5@hotel.d1juzfe.mongodb.net/?retryWrites=true&w=majority&appName=Hotel');

// Connection function
export async function connectDB() {
  try {
    if (!MONGODB_URI) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI environment variable is required for production');
      } else {
        console.warn('No MongoDB URI configured. Database operations will be disabled.');
        return;
      }
    }

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
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      console.warn('Database connection failed in development mode. Continuing without database.');
    }
  }
}

// Initialize connection
connectDB();

export { mongoose };