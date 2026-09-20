const express = require("express");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.get("/", (req, res) => {
  res.send("SEHGAL GROUP Server is running!");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });