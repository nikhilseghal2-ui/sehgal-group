const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Dishwash",
    description: "Removes tough grease and keeps dishes sparkling clean.",
    price: 199,
    oldPrice: 249,
    image: "/images/dishwash.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Detergent",
    description: "Deep cleaning detergent for fresh and clean clothes.",
    price: 299,
    oldPrice: 399,
    image: "/images/detergent.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Floor Cleaner",
    description: "Powerful floor cleaning with a fresh fragrance.",
    price: 229,
    oldPrice: 299,
    image: "/images/floor-cleaner.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Toilet Cleaner",
    description: "Helps remove stains and keeps your toilet fresh.",
    price: 149,
    oldPrice: 199,
    image: "/images/toilet-cleaner.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Bathroom Cleaner",
    description: "Effective cleaning for bathroom surfaces.",
    price: 239,
    oldPrice: 299,
    image: "/images/bathroom-cleaner.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Glass Cleaner",
    description: "Leaves glass surfaces clean, clear and shining.",
    price: 159,
    oldPrice: 199,
    image: "/images/glass-cleaner.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Surface Cleaner",
    description: "Everyday cleaning for tables, counters and surfaces.",
    price: 199,
    oldPrice: 249,
    image: "/images/surface-cleaner.jpg",
    stock: 50,
    category: "Cleaning",
  },
  {
    name: "Scrubber",
    description: "Strong and durable scrubber for everyday cleaning.",
    price: 69,
    oldPrice: 99,
    image: "/images/scrubber.jpg",
    stock: 50,
    category: "Cleaning",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("8 Products Added Successfully!");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

seedProducts();