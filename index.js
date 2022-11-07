const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

const verifyJWT = (req, res, next) => {
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized Access' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(user);
    req.user = user;

    next();
  } catch (error) {
    res.status(403).send({ message: 'Forbidden Access' });
  }
};

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
app.get('/orders', verifyJWT, async (req, res) => {
  // console.log(req.query.email);
  const user = req.user;
  console.log(user);

  if (user.email !== req.query.email) {
    return res.status(403).send({ message: 'Forbidden Access' });
  }

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
app.post('/orders', verifyJWT, async (req, res) => {
  try {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* POST [For => JWT]
app.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.send({ token });
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* UPDATE (PATCH)
app.patch('/orders/:id', verifyJWT, async (req, res) => {
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
app.delete('/orders/:id', verifyJWT, async (req, res) => {
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
