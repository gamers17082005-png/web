const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET"
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: "order_rcptid_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Error creating order");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});