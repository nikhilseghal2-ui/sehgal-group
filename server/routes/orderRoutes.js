const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (
      !customer?.name ||
      !customer?.mobile ||
      !customer?.address ||
      !customer?.city ||
      !customer?.pincode
    ) {
      return res
        .status(400)
        .json({ message: "All delivery details are required." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
   // CHECK AND REDUCE STOCK
for (const item of items) {
  const product = await Product.findById(item.productId);

  if (!product) {
    return res.status(404).json({
      message: `Product ${item.name} not found.`,
    });
  }

  if (product.stock < item.quantity) {
    return res.status(400).json({
      message: `${item.name} has only ${product.stock} item(s) left.`,
    });
  }
}

// Reduce stock
for (const item of items) {
  await Product.findByIdAndUpdate(
    item.productId,
    {
      $inc: { stock: -item.quantity },
    }
  );
}
    const order = await Order.create({
      customer,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
const userId = req.user.userId;

const orders = await Order.find({
  "customer.userId": userId,
}).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.customer.userId) !== String(req.user.userId)) {
      return res.status(403).json({
        message: "You are not allowed to cancel this order.",
      });
    }

    if (order.orderStatus !== "PLACED") {
      return res.status(400).json({
        message: "Only placed orders can be cancelled.",
      });
    }

for (const item of order.items) {
  const updatedProduct = await Product.findByIdAndUpdate(
    item.productId,
    {
      $inc: {
        stock: item.quantity,
      },
    },
    { new: true }
  );

  console.log("Restoring stock:");
  console.log("Product ID:", item.productId);
  console.log("Quantity:", item.quantity);
  console.log("Updated Product:", updatedProduct);
}

    order.orderStatus = "CANCELLED";

    await order.save();

    res.json({
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    res.status(500).json({
      message: "Failed to cancel order.",
    });
  }
});



// UPDATE ORDER STATUS
router.put("/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "PLACED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
});
module.exports = router;