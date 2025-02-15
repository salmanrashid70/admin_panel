import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MongoDB URI in the environment variables");
}

// Define a Type for Cached Connection
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Store Cached Connection in Global Scope
declare global {
  var mongooseCache: MongooseCache;
}

// Initialize Cache Object
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectDB() {
  if (global.mongooseCache.conn) {
    console.log("Already connected to MongoDB");
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "cee_dev",
      })
      .then((mongooseInstance) => mongooseInstance.connection); // Extract connection object
  }

  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}
