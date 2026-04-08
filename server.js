const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const PORT = 5000;
const JWT_SECRET = "supersecretkey";

// ===== FILES =====
const PRODUCTS_FILE = "products.json";
const ORDERS_FILE = "orders.json";

// ===== INIT FILES =====
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, "[]");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");

// ===== SERVE UPLOADS =====
app.use("/uploads", express.static("uploads"));

// ===== MULTER SETUP =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ===== RAZORPAY =====
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",        // 🔁 CHANGE
  key_secret: "YOUR_KEY_SECRET" // 🔁 CHANGE
});

// ===== HELPERS =====
const readJSON = (file) => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ===== ADMIN LOGIN =====
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ===== AUTH MIDDLEWARE =====
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ===== UPLOAD IMAGE =====
app.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ===== PRODUCTS =====

// GET PRODUCTS
app.get("/products", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  res.json(products);
});

// ADD PRODUCT
app.post("/products", verifyToken, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    image: req.body.image, // comes from upload API
  };

  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);

  res.json({ message: "Product added", product: newProduct });
});

// DELETE PRODUCT
app.delete("/products/:id", verifyToken, (req, res) => {
  let products = readJSON(PRODUCTS_FILE);

  products = products.filter((p) => p.id != req.params.id);
  writeJSON(PRODUCTS_FILE, products);

  res.json({ message: "Product deleted" });
});

// ===== CREATE ORDER =====
app.post("/create-order", async (req, res) => {
  const { cart, address } = req.body;

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });

  // DELIVERY LOGIC
  const state = address.state.toLowerCase();
  let delivery = 199;

  if (state.includes("andhra") || state.includes("telangana")) {
    delivery = 99;
  }

  total += delivery;

  try {
    const order = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
    });

    res.json({
      orderId: order.id,
      amount: total,
      delivery,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SAVE ORDER =====
app.post("/verify-payment", (req, res) => {
  const { cart, address, paymentId } = req.body;

  const orders = readJSON(ORDERS_FILE);

  const newOrder = {
    id: "ORD" + Date.now(),
    cart,
    address,
    paymentId,
    status: "Placed",
    date: new Date(),
  };

  orders.push(newOrder);
  writeJSON(ORDERS_FILE, orders);

  res.json({ message: "Order saved", order: newOrder });
});

// ===== GET ALL ORDERS (ADMIN) =====
app.get("/orders", verifyToken, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

// ===== TRACK ORDER =====
app.get("/track/:id", (req, res) => {
  const orders = readJSON(ORDERS_FILE);

  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// ===== UPDATE ORDER STATUS =====
app.put("/orders/:id", verifyToken, (req, res) => {
  const orders = readJSON(ORDERS_FILE);

  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status;
  writeJSON(ORDERS_FILE, orders);

  res.json({ message: "Order updated" });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
