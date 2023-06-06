const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const kafka = new Kafka({
  clientId: 'ecom-app',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
});

const producer = kafka.producer();


// await producer.send({
//   topic: 'test-topic',
//   messages: [
//     { value: 'Hello KafkaJS user!' },
//   ],
// })

app.use(express.json());

app.post('/orders', async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    // Retry function for producing events
    const produceEvent = async () => {
      try {
        await producer.connect();
        await producer.send({
          topic: 'order-created',
          messages: [{ value: JSON.stringify({ orderId, productId, quantity }) }],
        });
        console.log('Order event produced successfully');
        return res.status(201).json({ message: 'Order created' });
      } catch (error) {
        console.error('Error producing event:', error);
        // Retry if the producer is disconnected
        if (error.type === 'PRODUCER_NOT_CONNECTED_ERROR') {
          console.log('Retrying event production...');
        //   await producer.connect();
        //   await produceEvent();
        } else {
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
    };

    // Produce event to Kafka topic
    await produceEvent();
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Order service is running on port 3000');
});
