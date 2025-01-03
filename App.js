const express = require('express');
const cors = require('cors');
const { default: connectDB } = require('./DB/Connection');
const { DataAPIClient } = require("@datastax/astra-db-ts");
const client = new DataAPIClient('AstraCS:UTMYsFZDhjFoCiQIlZJiKIoD:9c2d976166e1c3f908d3e93f24a320a4aceff48302f12699bbc6a059f118e936');
const dbName = 'https://e4804280-a8a3-4f0c-ad46-3f46d7eb8b4f-us-east-2.apps.astra.datastax.com';

const app = express();
app.use(cors());
app.use(express.json());

const collectionName = 'mock_data'; // Replace with your actual collection name

let collection;
(async () => {
    try {
      const db = client.db(dbName);
      collection = db.collection(collectionName);
      console.log('Connected to AstraDB and initialized collection');
      return db;
    } catch (error) {
      console.error('Error connecting to AstraDB:', error);
      return null;
    }
  })();



app.get('/', async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send('Database connection not initialized');
    }
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
