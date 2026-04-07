// CART ARRAY
let cart = [];

// ADD TO CART
function addToCart(name, price) {
  cart.push({ name, price });
  document.getElementById("cart-count").innerText = cart.length;
}

// TOGGLE CART PANEL
function toggleCart() {
  let panel = document.getElementById("cart-panel");

  if (panel.style.right === "0px") {
    panel.style.right = "-300px";
  } else {
    panel.style.right = "0px";
  }

  renderCart();
}

// RENDER CART ITEMS
function renderCart() {
  let panel = document.getElementById("cart-panel");

  if (cart.length === 0) {
    panel.innerHTML = "<h2>Your Cart</h2><p>Cart is empty</p>";
    return;
  }

  let total = 0;
  panel.innerHTML = "<h2>Your Cart</h2>";

  cart.forEach(item => {
    total += item.price;
    panel.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
  });

  panel.innerHTML += `<h3>Total: ₹${total}</h3>`;
  panel.innerHTML += `<button onclick="checkout()">Checkout</button>`;
}

// CHECKOUT FUNCTION
function checkout() {
  alert("Order placed successfully! 🙏");
  cart = [];
  document.getElementById("cart-count").innerText = 0;
  renderCart();
}

// SCROLL TO PRODUCTS
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
}
