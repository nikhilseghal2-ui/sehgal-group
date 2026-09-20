const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// CUSTOMER SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check required fields
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.status(201).json({
  message: "Account created successfully.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  },
});
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to create account.",
    });
  }
});
// CUSTOMER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.json({
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  },
});
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Failed to login.",
    });
  }
});
// FORGOT PASSWORD - CHECK EMAIL
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }

const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({
    message: "No account found with this email.",
  });
}

// Create a secure random reset token
const resetToken = require("crypto")
  .randomBytes(32)
  .toString("hex");

// Token will expire after 15 minutes
user.resetToken = resetToken;
user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

await user.save();

res.json({
  message: "Password reset request created.",
  resetToken,
});

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Failed to process password reset.",
    });
  }
});
// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
    console.log("RESET PASSWORD ROUTE HIT");
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Failed to reset password.",
    });
  }
});
module.exports = router;