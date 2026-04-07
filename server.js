const express = require("express");
const cors = require("cors");
const fs = require("fs");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// ================== CONFIG ==================
const SECRET = "mysecretkey";

// Razorpay
const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_KEY_SECRET"
});

// ================== FILE SETUP ==================
if (!fs.existsSync("orders.json")) fs.writeFileSync("orders.json", "[]");
if (!fs.existsSync("products.json")) fs.writeFileSync("products.json", "[]");

// ================== IMAGE UPLOAD ==================
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// ================== AUTH ==================
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token");

  jwt.verify(token, SECRET, (err) => {
    if (err) return res.status(401).send("Invalid token");
    next();
  });
}

// ================== ADMIN LOGIN ==================
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ user: "admin" }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid login" });
  }
});

// ================== CREATE ORDER (RAZORPAY) ==================
app.post("/create-order", async (req, res) => {
  try {
    const { amount, state } = req.body;

    let delivery = 199;
    if (
      state.toLowerCase() === "andhra pradesh" ||
      state.toLowerCase() === "telangana"
    ) {
      delivery = 99;
    }

    const total = amount + delivery;

    const order = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR"
    });

    res.json({ order, delivery, total });
  } catch (err) {
    res.status(500).send(err);
  }
});

// ================== SAVE ORDER ==================
app.post("/save-order", (req, res) => {
  const order = req.body;

  let orders = JSON.parse(fs.readFileSync("orders.json"));

  order.status = "Pending";
  orders.push(order);

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Order saved" });
});

// ================== GET ORDERS ==================
app.get("/orders", verifyToken, (req, res) => {
  const orders = JSON.parse(fs.readFileSync("orders.json"));
  res.json(orders);
});

// ================== UPDATE ORDER STATUS ==================
app.post("/update-status", verifyToken, (req, res) => {
  const { index, status } = req.body;

  let orders = JSON.parse(fs.readFileSync("orders.json"));

  orders[index].status = status;

  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Updated" });
});

// ================== PRODUCTS ==================

// GET PRODUCTS
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync("products.json"));
  res.json(products);
});

// ADD PRODUCT
app.post("/add-product", verifyToken, (req, res) => {
  const product = req.body;

  let products = JSON.parse(fs.readFileSync("products.json"));

  products.push(product);

  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  res.json({ message: "Product added" });
});

// DELETE PRODUCT
app.post("/delete-product", verifyToken, (req, res) => {
  const { index } = req.body;

  let products = JSON.parse(fs.readFileSync("products.json"));

  products.splice(index, 1);

  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  res.json({ message: "Deleted" });
});

// ================== IMAGE UPLOAD ==================
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ image: req.file.filename });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
