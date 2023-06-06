const express = require('express');
const { Kafka, logLevel } = require('kafkajs');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3001;

const kafka = new Kafka({
  clientId: 'ecom-app',
  brokers: ['kafka:9092'],
  logLevel: logLevel.ERROR,
});

// MongoDB connection setup
const mongoURI = 'mongodb://mongo:27017';
const client = new MongoClient(mongoURI);

// Function to update product quantity in MongoDB
const updateProductQuantity = async (productId, quantity) => {
  await client.connect();
  const db = client.db('products_db');
  const productsCollection = db.collection('products');
  await productsCollection.updateOne(
    { productId },
    { $inc: { quantity: -quantity } }
  );
  console.log('quantity updated successfuly!')
  await client.close();
};

// Express routes
app.get('/', (req, res) => {
  res.send('Hello from product-service');
});

// Kafka Consumer
const consumer = kafka.consumer({ groupId: 'product-group' });

const runConsumer = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log('event received successfully -> ', {
        partition,
        offset: message.offset,
        value: order,
      });
      // Update product quantity in MongoDB
      await updateProductQuantity(order.productId, order.quantity);
    },
  });
};

// Function to seed MongoDB with initial data
const seedMongoDB = async () => {
  await client.connect();
  const db = client.db('products_db');
  const productsCollection = db.collection('products');
  await productsCollection.insertOne({
    orderId: '1',
    productId: '1',
    quantity: 10,
  });
  console.log('database seeded successfuly!')
  await client.close();
};

// Start the server and run the consumer
const startServer = async () => {
  try {
    await seedMongoDB();
    await runConsumer().catch(console.error);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
