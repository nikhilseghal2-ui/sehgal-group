const express = require("express");
const Product = require("../models/Product");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// ADD PRODUCT
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      image,
      stock,
      category,
    } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({
        message: "Name, description, price and image are required.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      oldPrice: oldPrice || 0,
      image,
      stock: stock || 0,
      category: category || "Cleaning",
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      message: "Failed to add product",
    });
  }
});
// UPDATE PRODUCT
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      image,
      stock,
      category,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        oldPrice,
        image,
        stock,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
});
// DELETE PRODUCT
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
});

module.exports = router;