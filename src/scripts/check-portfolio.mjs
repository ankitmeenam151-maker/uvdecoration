import { MongoClient } from "mongodb";
const uri = "mongodb://user:0qTOpDtIQbufbk06@ac-jrbvwyu-shard-00-00.nhwzaox.mongodb.net:27017,ac-jrbvwyu-shard-00-01.nhwzaox.mongodb.net:27017,ac-jrbvwyu-shard-00-02.nhwzaox.mongodb.net:27017/uv_decor?ssl=true&replicaSet=atlas-11tkq6-shard-0&authSource=admin";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const db = client.db("uv_decor");
    const list = await db.collection("portfolio").find({}).toArray();
    console.log("PORTFOLIO_COUNT:", list.length);
    console.log("PORTFOLIO_LIST:", JSON.stringify(list, null, 2));
  } catch (err) {
    console.error("DB_ERROR:", err.message);
  } finally {
    await client.close();
  }
}
run();
