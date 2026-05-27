import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MONGODB_URI to the .env file.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("\n❌ MongoDB Connection Error!");
      if (uri.includes("<db_password>")) {
        console.error("👉 Please replace '<db_password>' with your actual database password in the .env file.");
      }
      console.error("Error details:", err.message, "\n");
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect().catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  });
}

export default clientPromise;

/**
 * Returns the MongoDB database instance.
 */
export async function connectToDatabase() {
  const client = await clientPromise;
  // Use 'uv_decor' as the database name
  return client.db("uv_decor");
}
