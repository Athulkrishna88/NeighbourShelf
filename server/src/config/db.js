const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('Connecting to MongoDB via MONGODB_URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
      });
      console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB connection failed: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('Cannot start in production without a valid MongoDB connection.');
        process.exit(1);
      }
      console.warn('Falling back to in-memory MongoDB for local development...');
    }
  }

  // Fallback to MongoMemoryServer for instant local run (development only)
  if (process.env.NODE_ENV === 'production') {
    console.error('MONGODB_URI is required in production. Please set it in environment variables.');
    process.exit(1);
  }

  try {
    console.log('Starting local MongoMemoryServer instance for zero-config local development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to in-memory MongoDB at: ${memoryUri}`);
  } catch (memErr) {
    console.error('Failed to connect to MongoDB:', memErr.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
