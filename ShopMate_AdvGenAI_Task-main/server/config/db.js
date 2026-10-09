const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const configuredUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const fallbackUri = 'mongodb://127.0.0.1:27017';
const dbName = 'shopmate';

let db;

const connectDB = async () => {
  if (db) return db;

  const candidateUris = [configuredUri];
  if (configuredUri !== fallbackUri) {
    candidateUris.push(fallbackUri);
  }

  for (const uri of candidateUris) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log(`MongoDB Connected Successfully (${uri})`);
      db = client.db(dbName);
      return db;
    } catch (error) {
      console.error(`MongoDB Connection Failed for ${uri}:`, error.message);
    }
  }

  console.error('MongoDB is not reachable. Start a local MongoDB server or fix the Atlas connection string.');
  process.exit(1);
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };
