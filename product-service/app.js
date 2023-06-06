const express = require('express');
const { Kafka, logLevel } = require('kafkajs');
const app = express()
const port = 3001

const kafka = new Kafka({
    clientId: 'ecom-app',
    brokers: ['kafka:9092'],
    logLevel: logLevel.ERROR,
  });

app.get('/', (req, res) => {
  res.send('Hello from product-service')
})
    
    
    const consumer = kafka.consumer({ groupId: 'product-group' })
    
    const runConsumer = async () => {
    
      // Consuming
      await consumer.connect()
      await consumer.subscribe({ topic: 'order-created', fromBeginning: true })
    
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log('event received successfuly -> ',{
            partition,
            offset: message.offset,
            value: message.value.toString(),
          })
        },
      })
    }
    
// Start the consumer when the server starts
const startServer = async () => {
    try {
        await runConsumer().catch(console.error)
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
          })
    } catch (error) {
      console.error('Error starting the server:', error);
    }
  };
  
  startServer();
  















/////////////////////////////////////////////////


// const { Kafka } = require('kafkajs');
// const { MongoClient } = require('mongodb');

// const kafka = new Kafka({
//   clientId: 'product-service',
//   brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
// });

// const consumer = kafka.consumer({ groupId: 'product-group' });
// // const mongoUrl = 'mongodb://mongo:27017';
// // const mongoDbName = 'product-db';

// const connectToMongoDb = async () => {
// //   const client = new MongoClient(mongoUrl);
// //   await client.connect();
// //   return client.db(mongoDbName);

// // mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect('mongodb://mongo:27017/product-db', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Failed to connect to MongoDB', err));
// };

// const processOrderCreatedEvent = async (order) => {
//   try {
//     const db = await connectToMongoDb();
//     const productsCollection = db.collection('products');

//     // Find the product by productId
//     const product = await productsCollection.findOne({ productId: order.productId });

//     if (product) {
//       // Update product quantity
//       const updatedQuantity = product.quantity - order.quantity;
//       await productsCollection.updateOne({ productId: order.productId }, { $set: { quantity: updatedQuantity } });
//       console.log(`Product quantity updated for productId: ${order.productId}`);
//     } else {
//       console.log(`Product not found for productId: ${order.productId}`);
//     }
//   } catch (error) {
//     console.error('Error processing order created event:', error);
//   }
// };

// const runConsumer = async () => {
//   try {
//     await consumer.connect();
//     await consumer.subscribe({ topic: 'order-created', fromBeginning: true });

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         const order = JSON.parse(message.value.toString());
//         console.log(`Received order created event: ${JSON.stringify(order)}`);
//         await processOrderCreatedEvent(order);
//       },
//     });
//   } catch (error) {
//     console.error('Error running Kafka consumer:', error);
//   }
// };

// runConsumer().catch((error) => {
//   console.error('Error starting Kafka consumer:', error);
// });
