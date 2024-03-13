const express = require("express");
const dotenv = require("dotenv");

const app = express();

// Load environment variables from a .env file
dotenv.config();

// Define the port for the Express app
const PORT = process.env.PORT;

// Enable JSON parsing for incoming requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api ready coy");
});

const productController = require("./product/product.controller");
app.use("/products", productController);

app.listen(PORT, () => {
  console.log(`Express API running in port: http://localhost:${PORT}`);
});
