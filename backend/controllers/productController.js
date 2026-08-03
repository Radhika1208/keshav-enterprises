import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc  Get products with search, category filter, pagination
// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const filter = { isActive: true };

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.featured) {
    filter.isFeatured = true;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort(req.query.sort === "price_asc" ? "price" : req.query.sort === "price_desc" ? "-price" : "-createdAt")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Create product (admin)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, sku, description, category, brand, price, mrp,
    unit, stock, images, isSterile, isReusable, hsnCode, specifications, isFeatured,
  } = req.body;

  if (!name || !sku || !description || !category || price == null || mrp == null) {
    res.status(400);
    throw new Error("Missing required product fields");
  }

  const skuExists = await Product.findOne({ sku });
  if (skuExists) {
    res.status(400);
    throw new Error("A product with this SKU already exists");
  }

  const product = await Product.create({
    name, sku, description, category, brand, price, mrp,
    unit, stock, images, isSterile, isReusable, hsnCode, specifications, isFeatured,
  });

  res.status(201).json(product);
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const fields = [
    "name", "description", "category", "brand", "price", "mrp", "unit",
    "stock", "images", "isSterile", "isReusable", "hsnCode", "specifications",
    "isFeatured", "isActive",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  const updated = await product.save();
  res.json(updated);
});

// @desc  Delete product (admin) - soft delete
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  product.isActive = false;
  await product.save();
  res.json({ message: "Product removed" });
});
