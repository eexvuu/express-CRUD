// service layer bertujuan untuk handle business logic
const prisma = require("../db");
const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

const getAllProducts = async () => {
  const products = await findProducts();
  // Sort products by ID in ascending order
  const sortedProducts = products.sort((a, b) => a.id - b.id);

  return sortedProducts;
};

const getProductById = async (id) => {
  // Validate that the id parameter is a valid number
  if (isNaN(id) || !Number.isInteger(id)) {
    throw new Error("Invalid id parameter");
  }

  const product = await findProductById(id);

  // Check if the product exists
  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const createProduct = async (productData) => {
  // Validate that required fields are present in the request body
  if (!productData || !productData.name || !productData.price) {
    throw new Error("Incomplete product data");
  }

  // Validate the data types of specific fields (e.g., ensure price is a number)
  if (typeof productData.price !== "number") {
    throw new Error("Invalid data type for 'price'");
  }

  // Create a new product in the database
  const product = await insertProduct(productData);

  return product;
};

const deleteProductById = async (id) => {
  // Validate that the id parameter is a valid number
  await getProductById(id);

  // Delete the product from the database
  await deleteProduct(id);
};

const editProductById = async (id, productData) => {
  // Validate that the id parameter is a valid number
  await getProductById(id);

  // Validate that the "price" field is a number or undefined
  if (
    typeof productData.price !== "number" &&
    productData.price !== undefined
  ) {
    throw new Error("Invalid data type for 'price'");
  }

  const updatedProduct = await editProduct(id, productData);
  return updatedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
};
