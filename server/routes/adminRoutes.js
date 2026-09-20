const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Contact = require("../models/Contact");
const adminMiddleware = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Order = require("../models/Order");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

const isPasswordValid = await bcrypt.compare(
  password,
  process.env.ADMIN_PASSWORD
);

if (
  email !== process.env.ADMIN_EMAIL ||
  !isPasswordValid
) {
  return res.status(401).json({
    message: "Invalid admin email or password.",
  });
}

    const token = jwt.sign(
      {
        role: "admin",
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Admin login successful.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Failed to login as admin.",
    });
  }
});
router.get("/contacts", adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error("Fetch contact messages error:", error);

    res.status(500).json({
      message: "Failed to fetch contact messages.",
    });
  }
});
router.get("/customers", adminMiddleware, async (req, res) => {
  try {
    const customers = await User.find()
      .select("-password -resetToken -resetTokenExpiry")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    console.error("Fetch customers error:", error);

    res.status(500).json({
      message: "Failed to fetch customers.",
    });
  }
});
router.get("/orders", adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Fetch admin orders error:", error);

    res.status(500).json({
      message: "Failed to fetch admin orders.",
    });
  }
});
router.get("/verify", adminMiddleware, (req, res) => {
  res.json({
    valid: true,
    message: "Admin token is valid.",
  });
});



module.exports = router;