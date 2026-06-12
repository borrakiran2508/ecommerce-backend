const Product = require("../models/Product");

// get all producct

const getAllProducts = async (req, res) => {
  const { category, search, sort } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const sortOptions = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };

  const products = await Product.find(filter)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .populate("seller", "name email");

  res.json(products);
};

// get product by Id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name email"
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  res.json(product);
};

//  create product(seller admin)
 
const createProduct = async (req, res) => {
  const { title, description, price, stock, category, image } = req.body;

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    image,
    seller: req.user._id,
  });

  res.status(201).json(product);
};

// update productById (seller admin)

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to update this product." });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
};

//   DELETE product (seller or admin)
 
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this product." });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully." });
};



module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};