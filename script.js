let cart = [];
let products = [];

// LOAD PRODUCTS
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    loadProducts();
  });

function loadProducts() {
  let container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });
}

function addToCart(id) {
  let p = products.find(x => x.id === id);
  let item = cart.find(x => x.id === id);

  if (item) item.qty++;
  else cart.push({ ...p, qty: 1 });

  updateCart();
}

function updateCart() {
  let div = document.getElementById("cart");
  let count = document.getElementById("cartCount");

  let html = "<h2>Cart</h2>";
  let total = 0;

  cart.forEach(i => {
    total += i.price * i.qty;
    html += `<p>${i.name} x${i.qty}</p>`;
  });

  html += `<h3>Total ₹${total}</h3>`;
  html += `<button onclick="checkout()">Checkout</button>`;

  div.innerHTML = html;
  count.innerText = cart.length;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

// WHATSAPP CHECKOUT
function checkout() {
  let msg = "Order:%0A";
  cart.forEach(i => {
    msg += `${i.name} x${i.qty}%0A`;
  });

  window.open(`https://wa.me/919876543210?text=${msg}`);
}
