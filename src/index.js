const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma client
const prisma = new PrismaClient();
const app = express();

// Load environment variables from a .env file
dotenv.config();

// Define the port for the Express app
const PORT = process.env.PORT;

// Enable JSON parsing for incoming requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api ready");
});

// get method
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.send(products);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  // Validate that the id parameter is a valid number
  if (isNaN(id) || !Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  // Check if the product exists
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.send(product);
});

// post method
app.post("/products", async (req, res) => {
  try {
    // Extract product data from the request body
    const newProductData = req.body;

    // Validate that required fields are present in the request body
    if (!newProductData || !newProductData.name || !newProductData.price) {
      return res.status(400).json({ error: "Incomplete product data" });
    }

    // Validate the data types of specific fields (e.g., ensure price is a number)
    if (typeof newProductData.price !== "number") {
      return res.status(400).json({ error: "Invalid data type for 'price'" });
    }

    // Create a new product in the database
    const product = await prisma.product.create({
      data: {
        name: newProductData.name,
        description: newProductData.description || null, // Allow null for optional fields
        price: newProductData.price,
        image: newProductData.image || null, // Allow null for optional fields
      },
    });

    // Send a response with the created product data and a success message
    res.send({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// put method
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Validate that the id parameter is a valid number
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid id parameter" });
    }

    // Validate that required fields are present in the request body
    if (!productData || !productData.name || !productData.price) {
      return res.status(400).json({ error: "Incomplete product data" });
    }

    // Validate the data types of specific fields (e.g., ensure price is a number)
    if (typeof productData.price !== "number") {
      return res.status(400).json({ error: "Invalid data type for 'price'" });
    }

    // Check if the product exists before attempting to update it
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
      },
    });

    res.send({ data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete method
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Validate that the id parameter is a valid number
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid id parameter" });
    }

    // Check if the product exists before attempting to delete it
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Express API running in port: http://localhost:${PORT}`);
});
