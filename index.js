const express = require('express');
const cors = require('cors');
require('colors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

// Mongodb Atlas
// username: geniusDBUser
// password: hAUHLBYUur9OGuvi
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeflywl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database connected'.yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
};

dbConnect();

const serviceCollection = client.db('geniusCar').collection('services');

app.get('/', (req, res) => {
  res.send('Genius car Server Side');
});

app.post('/users', async (req, res) => {
  try {
  } catch (error) {}
});

app.listen(port, () => {
  console.log('Server up and running'.cyan.bold);
});
