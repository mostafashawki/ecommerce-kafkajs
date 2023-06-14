# Ecommerce Backend App

This is an example eCommerce backend application built using Node.js and Kafka. The app allows you to create orders and updates the product stock accordingly.

## Getting Started

To run the app, follow these steps:

1. Make sure you have Docker installed on your machine.
2. Clone this repository to your local machine.
3. Open a terminal and navigate to the project's root directory.
4. Run the following command to start the app and its dependencies:

```bash
docker-compose up
```

This command will spin up the main two services, order-service, and product-service, along with the required dependencies (Kafka, ZooKeeper, MongoDB).

## Usage

### Order Creation

To create an order, send a POST request to the order-service API:

URL: http://localhost:3000/orders

Request Body (JSON):
```json
{
  "orderId": "1",
  "productId": "1",
  "quantity": "1"
}
```

This will create a new event in Kafka, indicating the details of the order.

### Product Stock

When the app is running, the product-service will monitor the MongoDB database for changes. Initially, the \`products\` collection in the MongoDB database will have a record like this:

```json
{
  "_id": {
    "$oid": "647f9230793eafd61be5e6ad"
  },
  "orderId": "1",
  "productId": "1",
  "quantity": 10
}
```

Whenever a new order is created, the product-service will consume the event from Kafka and automatically decrease the stock of the corresponding product. For example, after consuming the order event, the product's quantity will be updated to:

```json
{
  "_id": {
    "$oid": "647f9230793eafd61be5e6ad"
  },
  "orderId": "1",
  "productId": "1",
  "quantity": 9
}
```

This ensures that the product stock is accurately maintained based on the orders received.

## Contributing

Contributions to this project are welcome. If you encounter any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
