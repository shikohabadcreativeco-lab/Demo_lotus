import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "lotus_light";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: Promise<MongoClient>;
};

function clientPromise() {
  if (!globalForMongo.mongoClient) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 800 });
    globalForMongo.mongoClient = client.connect();
  }
  return globalForMongo.mongoClient;
}

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise();
    return client.db(dbName);
  } catch (error) {
    globalForMongo.mongoClient = undefined;
    throw error;
  }
}
