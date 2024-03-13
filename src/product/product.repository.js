// berkomunikasi dengan databse
// boleh pakai orm / raw query
const prisma = require("../db");

const findProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return product;
};

const insertProduct = async (productData) => {
  // Create a new product in the database
  const product = await prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description || null, // Allow null for optional fields
      price: productData.price,
      image: productData.image || null, // Allow null for optional fields
    },
  });

  return product;
};

const deleteProduct = async (id) => {
  await prisma.product.delete({
    where: {
      id,
    },
  });
};

const editProduct = async (id, productData) => {
  // Update the product in the database
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image: productData.image,
    },
  });

  return updatedProduct;
};

module.exports = {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
};
