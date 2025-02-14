import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

const uri = process.env.MONGO_URI as string;
if (!uri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

// Cached client for reuse
let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedClient) {
    console.log("♻️ Using cached database connection");
    return cachedClient.db("myDatabase"); 
  }

  try {
    console.log("Establishing new database connection...");
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    console.log("Successfully connected to MongoDB");
    return client.db("myDatabase"); 
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
