const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

const contact = await Contact.create({
  name,
  email,
  phone,
  message,
});

console.log("New Contact Message Saved:", contact._id);

    res.status(201).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact error:", error);

    res.status(500).json({
      message: "Failed to send message.",
    });
  }
});

module.exports = router;