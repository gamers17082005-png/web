let cart = [];

// SAMPLE PRODUCTS
const products = [
  { id: 1, name: "Agarbatti", price: 100 },
  { id: 2, name: "Kumkum", price: 50 },
  { id: 3, name: "Camphor", price: 80 }
];

// LOAD PRODUCTS
function loadProducts() {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const product = products.find(p => p.id === id);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// UPDATE CART
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <p>
        ${item.name} x ${item.quantity}
        <button onclick="changeQty(${item.id},1)">+</button>
        <button onclick="changeQty(${item.id},-1)">-</button>
      </p>
    `;
  });

  cartTotal.innerText = "Total: ₹" + total;
  cartCount.innerText = cart.length;
}

// CHANGE QUANTITY
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

// TOGGLE CART
function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

// WHATSAPP CHECKOUT
function checkout() {
  if (cart.length === 0) return alert("Cart empty");

  let msg = "🛕 HSV Sugandhika Order %0A%0A";
  let total = 0;

  cart.forEach(i => {
    msg += `${i.name} x${i.quantity} = ₹${i.price * i.quantity}%0A`;
    total += i.price * i.quantity;
  });

  let state = prompt("Enter your state:");
  let delivery = (state === "andhra pradesh" || state === "telangana") ? 99 : 199;

  total += delivery;

  let name = prompt("Enter your name:");
  let address = prompt("Enter address:");

  msg += `%0A🚚 Delivery: ₹${delivery}`;
  msg += `%0A💰 Total: ₹${total}`;
  msg += `%0A👤 ${name}`;
  msg += `%0A📍 ${address}`;

  window.open(`https://wa.me/919876543210?text=${msg}`);
}

// INIT
loadProducts();
