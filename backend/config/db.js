const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vehicle_service_db';
  const useInMemory = process.env.USE_IN_MEMORY_DB;

  if (useInMemory === 'true') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      console.log(`[DB] Starting embedded MongoMemoryServer at ${inMemoryUri}`);
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[DB] Connected to In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('[DB] Failed to launch MongoMemoryServer:', err.message);
      process.exit(1);
    }
  }

  // If auto or default: try real MongoDB first with a short timeout, fallback to MongoMemoryServer
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    if (useInMemory === 'auto' || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.warn(`[DB] Local MongoDB not reachable at ${uri} (${err.message}).`);
      console.log('[DB] Auto-falling back to embedded MongoMemoryServer for instant local evaluation...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const inMemoryUri = mongod.getUri();
        const conn = await mongoose.connect(inMemoryUri);
        console.log(`[DB] Successfully connected to embedded In-Memory MongoDB: ${inMemoryUri}`);
        return conn;
      } catch (innerErr) {
        console.error('[DB] Failed to initialize embedded MongoMemoryServer:', innerErr.message);
        throw innerErr;
      }
    } else {
      console.error(`[DB] MongoDB Connection Error: ${err.message}`);
      throw err;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
