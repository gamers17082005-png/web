// ===== BACKEND URL =====
const BASE = "https://hsv-sugandhika.onrender.com"; // 🔁 REPLACE THIS

// ===== GLOBAL CART =====
let cart = [];

// ===== LOAD PRODUCTS =====
async function loadProducts() {
  try {
    const res = await fetch(`${BASE}/products`);
    const products = await res.json();

    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${BASE}${p.image}" width="150"/>
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ===== ADD TO CART =====
function addToCart(id, name, price, image) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  updateCartUI();
}

// ===== UPDATE CART UI =====
function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");
    div.innerHTML = `
      ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}
    `;
    cartItems.appendChild(div);
  });

  document.getElementById("cartTotal").innerText = total;
  cartCount.innerText = count;
}

// ===== OPEN CART =====
function openCart() {
  document.getElementById("cartSection").style.display = "block";
}

// ===== CLOSE CART =====
function closeCart() {
  document.getElementById("cartSection").style.display = "none";
}

// ===== CHECKOUT =====
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  document.getElementById("addressSection").style.display = "block";
}

// ===== PLACE ORDER =====
async function placeOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const state = document.getElementById("state").value;
  const addressLine = document.getElementById("address").value;

  if (!name || !phone || !state || !addressLine) {
    alert("Please fill all fields");
    return;
  }

  const address = {
    name,
    phone,
    state,
    address: addressLine,
  };

  try {
    const res = await fetch(`${BASE}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, address }),
    });

    const data = await res.json();

    startPayment(data, address);
  } catch (err) {
    console.error(err);
  }
}

// ===== RAZORPAY PAYMENT =====
function startPayment(orderData, address) {
  const options = {
    key: "YOUR_KEY_ID", // 🔁 REPLACE
    amount: orderData.amount * 100,
    currency: "INR",
    name: "HSV Sugandhika",
    description: "Order Payment",
    order_id: orderData.orderId,

    handler: async function (response) {
      await fetch(`${BASE}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          address,
          paymentId: response.razorpay_payment_id,
        }),
      });

      alert("Order placed successfully!");

      cart = [];
      updateCartUI();
      closeCart();
    },

    theme: {
      color: "#ff7a00",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// ===== ORDER TRACKING =====
function goToOrders() {
  const orderId = prompt("Enter your Order ID:");
  if (orderId) {
    window.location.href = `/orders.html?id=${orderId}`;
  }
}

// ===== SEARCH FILTER =====
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const value = this.value.toLowerCase();
      const products = document.querySelectorAll(".product");

      products.forEach((p) => {
        const text = p.innerText.toLowerCase();
        p.style.display = text.includes(value) ? "block" : "none";
      });
    });
  }
});

// ===== INIT =====
loadProducts();
// LOAD HEADER
fetch("./header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

// LOAD FOOTER
fetch("./footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });
