const express = require('express');
const cors = require('cors');
require('colors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

//* Mongodb Atlas
// username: geniusDBUser
// password: hAUHLBYUur9OGuvi
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

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
const orderCollection = client.db('geniusCar').collection('orders');

app.get('/', (req, res) => {
  res.send('Genius car Server Side');
});

//* GET (READ)
app.get('/services', async (req, res) => {
  try {
    const query = {};
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* GET (READ)
app.get('/services/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send(service);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* GET (READ)
// orders api
app.get('/orders', async (req, res) => {
  console.log(req.query.email);

  let query = {};
  if (req.query.email) {
    query = {
      email: req.query.email,
    };
  }

  const cursor = orderCollection.find(query);
  const orders = await cursor.toArray();
  // console.log(orders);
  res.send(orders);
});

//* POST (CREATE)
app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* UPDATE (PATCH)
app.patch('/orders/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: status,
      },
    };
    const result = await orderCollection.updateOne(filter, updatedDoc);

    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* DELETE (DELETE)
app.delete('/orders/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

app.listen(port, () => {
  console.log('Server up and running'.cyan.bold);
});
