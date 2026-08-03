import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// @desc Get all categories
// @route GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort("name");
  res.json(categories);
});

// @desc Create category (admin)
// @route POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }
  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const category = await Category.create({ name, slug: toSlug(name), description });
  res.status(201).json(category);
});

// @desc Update category (admin)
// @route PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  category.name = req.body.name ?? category.name;
  if (req.body.name) category.slug = toSlug(req.body.name);
  category.description = req.body.description ?? category.description;
  const updated = await category.save();
  res.json(updated);
});

// @desc Delete category (admin)
// @route DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.json({ message: "Category removed" });
});
