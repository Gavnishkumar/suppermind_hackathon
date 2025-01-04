const express = require('express');
const dotenv= require('dotenv')
const cors = require('cors');

dotenv.config();
const { default: connectDB } = require('./DB/Connection');
const { DataAPIClient } = require("@datastax/astra-db-ts");
const client = new DataAPIClient(process.env.DB_TOKEN);
const dbName = process.env.DB_NAME;

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
