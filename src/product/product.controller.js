// layer untuk handle request dan response
// Biasanya juga handle validasi body

const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
} = require("./product.service");

// get method
router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

// get product by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(Number(id));
    res.send(product);
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

// post method
router.post("/", async (req, res) => {
  try {
    // Extract product data from the request body
    const newProductData = req.body;

    const product = await createProduct(newProductData);

    // Send a response with the created product data and a success message
    res.send({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

// delete method
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await deleteProductById(Number(id));

    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

// put method
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const updatedProduct = await editProductById(Number(id), productData);

    res.send({ data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

// patch method
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const updatedProduct = await editProductById(Number(id), productData);

    res.send({ data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

module.exports = router;
