const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', 'config', '.env');
dotenv.config({ path: envPath });

 const uri = process.env.MONGO_URI;
//const uri = "mongodb://localhost:xxxxx/ViewTube";

const client = new MongoClient(uri, {
});

async function transformIds(data) {
  return data.map(item => {
    if (item._id && item._id.$oid) {
      item._id = new ObjectId(item._id.$oid);
    }
    if (item.userId && item.userId.$oid) {
      item.userId = new ObjectId(item.userId.$oid);
    }
    if (item.videoId && item.videoId.$oid) {
      item.videoId = new ObjectId(item.videoId.$oid);
    }
    if (item.createdAt && item.createdAt.$date) {
      item.createdAt = new Date(item.createdAt.$date);
    }
    return item;
  });
}

async function initData(collectionName, filePath) {
  const database = client.db('ViewTube');
  const collection = database.collection(collectionName);
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const transformedData = await transformIds(jsonData);
  const result = await collection.insertMany(transformedData);
  console.log(`${result.insertedCount} documents were inserted into ${collectionName}`);
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await initData('videos', path.join(__dirname, 'Viewtube.videos.json'));
    await initData('users', path.join(__dirname, 'Viewtube.users.json'));
    await initData('comments', path.join(__dirname, 'Viewtube.comments.json'));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

run().catch(console.dir);