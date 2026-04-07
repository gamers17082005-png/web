// IMPORTS
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

// APP SETUP
const app = express();
app.use(cors());
app.use(express.json());

// 🔑 RAZORPAY SETUP (replace with your real keys)
const razorpay = new Razorpay({
  key_id: "rzp_test_xxxxxxxx",       // 🔴 replace this
  key_secret: "xxxxxxxxxxxx"         // 🔴 replace this
});

// 🧾 TEMP STORAGE (for orders)
let orders = [];

// ==============================
// 💳 CREATE ORDER API
// ==============================
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Creating order for amount:", amount);

    const options = {
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    console.log("Order created:", order.id);

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error creating order");
  }
});

// ==============================
// 📦 SAVE ORDER AFTER PAYMENT
// ==============================
app.post("/save-order", (req, res) => {
  const orderData = req.body;

  console.log("Saving order:", orderData);

  orders.push(orderData);

  res.json({ message: "Order saved successfully" });
});

// ==============================
// 📊 GET ALL ORDERS (ADMIN)
// ==============================
app.get("/orders", (req, res) => {
  res.json(orders);
});

// ==============================
// 🌐 ROOT CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
