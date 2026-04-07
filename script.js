// =======================
// 🛒 CART SYSTEM
// =======================
let cart = [];

// ADD TO CART
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  console.log("Cart:", cart);
  updateCartUI();
}

// UPDATE CART UI
function updateCartUI() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) {
    console.error("cart-items not found ❌");
    return;
  }

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div>
        ${item.name} - ₹${item.price} x ${item.quantity}
        <button onclick="increaseQty(${index})">+</button>
        <button onclick="decreaseQty(${index})">-</button>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: ₹" + total;
  }
}

// INCREASE QTY
function increaseQty(index) {
  cart[index].quantity++;
  updateCartUI();
}

// DECREASE QTY
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}
