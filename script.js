const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Razorpay config
const razorpay = new Razorpay({
  key_id: "rzp_test_xxxxxxxx",
  key_secret: "your_secret_key"
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR"
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

// SAVE ORDER
app.post("/save-order", (req, res) => {
  const order = req.body;

  let orders = [];

  if (fs.existsSync("orders.json")) {
    orders = JSON.parse(fs.readFileSync("orders.json"));
  }

  orders.push(order);

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Order saved" });
});

// GET ORDERS (ADMIN)
app.get("/orders", (req, res) => {
  if (!fs.existsSync("orders.json")) return res.json([]);

  const orders = JSON.parse(fs.readFileSync("orders.json"));
  res.json(orders);
});

// UPDATE STATUS
app.post("/update-status", (req, res) => {
  const { index, status } = req.body;

  let orders = JSON.parse(fs.readFileSync("orders.json"));

  orders[index].status = status;

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Updated" });
});

app.listen(5000, () => console.log("Server running"));
